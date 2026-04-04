import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const loadImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/jpeg");
            resolve(dataURL);
        };
        img.onerror = () => resolve(null);
        img.src = url + (url.includes('?') ? '&' : '?') + 'not-from-cache-please';
    });
};

export const generateInvoice = async (order) => {
    // Show a quick browser alert if it takes a second to process images
    // toast isn't available here directly without passing it, so we rely on fast execution.

    try {
        const doc = new jsPDF();

        // Load all product images beforehand
        const images = await Promise.all(order.orderItems.map(item => loadImage(item.image)));

        // ── Header Styling ──
        doc.setFillColor(33, 42, 44); // Dark header bar
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.text("AEROLITH", 15, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(200, 200, 200);
        doc.text("Sustainable Footwear & Apparel", 15, 32);

        // ── Invoice Details ──
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 150, 25);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`#${order._id.slice(-8).toUpperCase()}`, 150, 32);

        // ── Billing & Shipping ──
        const billName = order.user?.username || [order.shippingAddress?.firstName, order.shippingAddress?.lastName].filter(Boolean).join(" ") || "Guest Customer";
        const billEmail = order.user?.email || order.shippingAddress?.email || "No email provided";

        doc.setTextColor(33, 42, 44); // Reset text color to black/charcoal
        doc.setFontSize(10);

        doc.setFont("helvetica", "bold");
        doc.text("BILLED TO:", 15, 55);
        doc.setFont("helvetica", "normal");
        doc.text(billName, 15, 62);
        doc.text(billEmail, 15, 67);

        doc.setFont("helvetica", "bold");
        doc.text("SHIPPED TO:", 85, 55);
        doc.setFont("helvetica", "normal");
        doc.text(`${order.shippingAddress.address}`, 85, 62);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 85, 67);
        doc.text(`${order.shippingAddress.country}`, 85, 72);

        doc.setFont("helvetica", "bold");
        doc.text("ORDER INFO:", 150, 55);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 62);
        doc.text(`Status:  ${order.isPaid ? 'Paid' : 'Unpaid'}`, 150, 67);
        doc.text(`Payment: ${order.paymentMethod || 'Standard'}`, 150, 72);

        // Horizontal Line
        doc.setDrawColor(220, 220, 220);
        doc.line(15, 80, 195, 80);

        // ── Table ──
        const tableRows = [];
        order.orderItems.forEach((item) => {
            tableRows.push([
                "", // Image placeholder
                item.size ? `${item.name}\n(Size: ${item.size})` : item.name,
                `INR ${item.price.toLocaleString("en-IN")}`,
                item.qty.toString(),
                `INR ${(item.price * item.qty).toLocaleString("en-IN")}`
            ]);
        });

        autoTable(doc, {
            startY: 90,
            head: [["Image", "Product", "Price", "Qty", "Total"]],
            body: tableRows,
            theme: "grid",
            headStyles: { fillColor: [245, 245, 242], textColor: [33, 42, 44], fontStyle: 'bold', lineColor: [220, 220, 220] },
            bodyStyles: { lineColor: [220, 220, 220] },
            styles: { fontSize: 9, minCellHeight: 22, valign: "middle" },
            columnStyles: {
                0: { cellWidth: 26, halign: "center" }, // Image column
                2: { halign: "right" },
                3: { halign: "center" },
                4: { halign: "right" }
            },
            didDrawCell: (data) => {
                if (data.column.index === 0 && data.cell.section === "body") {
                    const base64Img = images[data.row.index];
                    if (base64Img) {
                        try {
                            doc.addImage(base64Img, "JPEG", data.cell.x + 4, data.cell.y + 2, 18, 18);
                        } catch (e) {
                            console.warn("Failed to draw image cell", e);
                        }
                    }
                }
            },
        });

        // ── Totals ──
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 140;

        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", 140, finalY);
        doc.text(`INR ${Number(order.itemsPrice).toLocaleString("en-IN")}`, 195, finalY, { align: "right" });

        let currentY = finalY + 8;
        if (order.discountPrice > 0) {
            doc.text("Promo Discount:", 140, currentY);
            doc.setTextColor(45, 130, 80); // Green
            doc.text(`-INR ${Number(order.discountPrice).toLocaleString("en-IN")}`, 195, currentY, { align: "right" });
            doc.setTextColor(33, 42, 44);
            currentY += 8;
        }

        doc.text("Shipping:", 140, currentY);
        doc.text(`INR ${Number(order.shippingPrice).toLocaleString("en-IN")}`, 195, currentY, { align: "right" });
        currentY += 8;

        doc.text("GST (Included 15%):", 140, currentY);
        doc.text(`INR ${Number(order.taxPrice).toLocaleString("en-IN")}`, 195, currentY, { align: "right" });
        currentY += 10;

        // Total Box
        doc.setFillColor(245, 245, 242);
        doc.rect(135, currentY - 6, 62, 12, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Total Paid:", 140, currentY + 3);
        doc.text(`INR ${Number(order.totalPrice).toLocaleString("en-IN")}`, 195, currentY + 3, { align: "right" });

        // ── Footer ──
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150);
        doc.text("Thank you for shopping with AEROLITH. Sustainability is at the heart of everything we do.", 105, pageHeight - 15, { align: "center" });
        doc.text("For returns and support, visit aerolith.com/help", 105, pageHeight - 10, { align: "center" });

        // ── Save ──
        doc.save(`Invoice_AEROLITH_${order._id.slice(-8).toUpperCase()}.pdf`);
    } catch (error) {
        console.error("Invoice Generation Error:", error);
        alert(`Failed to generate invoice: ${error.message}`);
    }
};

