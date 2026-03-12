import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
    try {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        // ── Header Styling ──
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(33, 42, 44); // ab-charcoal
        doc.text("AEROLITH", 20, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(118, 118, 118); // ab-text-gray
        doc.text("Sustainable Footwear & Apparel", 20, 32);

        // ── Invoice Details ──
        doc.setFontSize(12);
        doc.setTextColor(33, 42, 44);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 140, 25);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice Rank: #${order._id.slice(-8).toUpperCase()}`, 140, 32);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 37);
        doc.text(`Status: ${order.isPaid ? 'Paid' : 'Unpaid'}`, 140, 42);

        // ── Billing & Shipping ──
        doc.line(20, 50, 190, 50); // Horizontal line

        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 20, 60);
        doc.setFont("helvetica", "normal");
        doc.text(order.user.username, 20, 65);
        doc.text(order.user.email, 20, 70);

        doc.setFont("helvetica", "bold");
        doc.text("Ship To:", 100, 60);
        doc.setFont("helvetica", "normal");
        doc.text(order.shippingAddress.address, 100, 65);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 100, 70);
        doc.text(order.shippingAddress.country, 100, 75);

        // ── Table ──
        const tableRows = [];
        order.orderItems.forEach((item) => {
            const itemData = [
                item.size ? `${item.name} (Size: ${item.size})` : item.name,
                `INR ${item.price.toLocaleString("en-IN")}`,
                item.qty,
                `INR ${(item.price * item.qty).toLocaleString("en-IN")}`,
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            startY: 85,
            head: [["Product", "Unit Price", "Qty", "Total"]],
            body: tableRows,
            theme: "striped",
            headStyles: { fillColor: [33, 42, 44], textColor: [255, 255, 255] },
            styles: { fontSize: 9 },
        });

        // ── Totals ──
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", 140, finalY);
        doc.text(`INR ${Number(order.itemsPrice).toLocaleString("en-IN")}`, 170, finalY, { align: "right" });

        doc.text("Shipping:", 140, finalY + 7);
        doc.text(`INR ${Number(order.shippingPrice).toLocaleString("en-IN")}`, 170, finalY + 7, { align: "right" });

        doc.text("Tax (15%):", 140, finalY + 14);
        doc.text(`INR ${Number(order.taxPrice).toLocaleString("en-IN")}`, 170, finalY + 14, { align: "right" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Total:", 140, finalY + 24);
        doc.text(`INR ${Number(order.totalPrice).toLocaleString("en-IN")}`, 170, finalY + 24, { align: "right" });

        // ── Footer ──
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150);
        doc.text("Thank you for shopping with AEROLITH. Sustainability is at the heart of everything we do.", 105, 280, { align: "center" });

        // ── Save ──
        doc.save(`Invoice_AEROLITH_${order._id.slice(-8)}.pdf`);
    } catch (error) {
        console.error("Invoice Generation Error:", error);
        alert(`Failed to generate invoice: ${error.message}`);
    }
};
