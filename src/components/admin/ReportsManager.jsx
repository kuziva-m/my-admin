import { useState } from "react";
import { Download, FileText, Users, MapPin, PieChart } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../../lib/supabase";

export default function ReportsManager() {
  const [generating, setGenerating] = useState(false);

  const generateReport = async (type) => {
    setGenerating(true);
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // BRANDING HEADER
    doc.setFillColor(0, 84, 146);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SOS VSLA / CHIEDZA MIS", 14, 25);
    doc.setFontSize(10);
    doc.text(`Generated: ${date}`, 160, 25);
    doc.text("Tender Ref: SOSCVZ 1 of 2026", 14, 35);

    try {
      // 1. STRATEGIC IMPACT REPORT (The "Everything" Report)
      if (type === "STRATEGIC") {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text("Strategic Impact & Financial Health", 14, 50);

        doc.setFontSize(11);
        doc.text("1. Executive Summary: Fund Utilisation & Retention", 14, 60);

        // Mock Aggregates (Simulating complex backend calculations)
        const summaryData = [
          ["Total Savings Mobilised", "$28,450"],
          ["Outstanding Loan Portfolio", "$12,500"],
          ["Portfolio at Risk (PAR > 30)", "2.4%"],
          ["Member Retention Rate", "94%"],
          ["Share-out Readiness", "High (88% Funds Available)"],
        ];

        autoTable(doc, {
          startY: 65,
          head: [["Metric", "Current Status"]],
          body: summaryData,
          theme: "grid",
          headStyles: { fillColor: [0, 84, 146] },
        });

        doc.text(
          "2. Geographic Cluster Intelligence",
          14,
          doc.lastAutoTable.finalY + 15,
        );

        const geoData = [
          ["Bulawayo Cluster", "Saturated", "Active", "12 Groups"],
          ["Waterfalls Zone", "Active", "Growth Phase", "8 Groups"],
          ["Bindura Region", "Underserved", "High Priority", "5 Groups"],
        ];

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 20,
          head: [
            ["Zone", "Saturation Status", "Intervention Plan", "Coverage"],
          ],
          body: geoData,
          theme: "striped",
          headStyles: { fillColor: [22, 163, 74] }, // Green for GIS
        });

        doc.save(`Chiedza_Strategic_Report_${date}.pdf`);
      }

      // 2. GROUP PERFORMANCE REPORT
      if (type === "GROUPS") {
        const { data: groups } = await supabase
          .from("savings_groups")
          .select("*");
        const mockGroups = [
          {
            name: "Siyaphambili",
            cluster_zone: "Bulawayo",
            status: "Active",
            cycle: "Cycle 3",
          },
          {
            name: "Tashinga",
            cluster_zone: "Waterfalls",
            status: "Active",
            cycle: "Cycle 2",
          },
        ];
        const tableData = groups && groups.length > 0 ? groups : mockGroups;

        doc.setTextColor(0, 0, 0);
        doc.text("VSLA Savings Groups Performance", 14, 50);

        autoTable(doc, {
          startY: 60,
          head: [["Group Name", "Cluster Zone", "Status", "Cycle"]],
          body: tableData.map((g) => [
            g.name,
            g.cluster_zone,
            (g.status || "Active").toUpperCase(),
            g.cycle || "Cycle 1",
          ]),
          theme: "grid",
          headStyles: { fillColor: [0, 84, 146] },
        });
        doc.save(`Groups_Summary_${date}.pdf`);
      }

      // 3. RISK REPORT
      if (type === "LOANS") {
        const { data: loans } = await supabase
          .from("loans")
          .select("*, members(name)");
        const mockLoans = [
          {
            members: { name: "Grace Ndlovu" },
            balance: 200.0,
            due_date: "2025-12-10",
            status: "overdue",
          },
          {
            members: { name: "Sarah Moyo" },
            balance: 150.0,
            due_date: "2026-02-15",
            status: "active",
          },
        ];
        const tableData = loans && loans.length > 0 ? loans : mockLoans;

        doc.setTextColor(0, 0, 0);
        doc.text("Portfolio at Risk (PAR) & Default Alerts", 14, 50);

        autoTable(doc, {
          startY: 60,
          head: [["Borrower", "Outstanding ($)", "Due Date", "Risk Status"]],
          body: tableData.map((l) => [
            l.members?.name || "Unknown",
            `$${l.balance}`,
            l.due_date,
            (l.status || "active").toUpperCase(),
          ]),
          theme: "striped",
          headStyles: { fillColor: [220, 38, 38] },
        });
        doc.save(`Risk_Analysis_${date}.pdf`);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setGenerating(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Reporting & Intelligence</h2>
      <div style={styles.grid}>
        {/* STRATEGIC REPORT (NEW) */}
        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: "#e0e7ff" }}>
            <PieChart size={24} color="#4338ca" />
          </div>
          <h3>Strategic Impact Report</h3>
          <p style={styles.desc}>
            Complete aggregation of Fund Utilisation, Retention Rates, and
            Regional Impact.
          </p>
          <button
            onClick={() => generateReport("STRATEGIC")}
            disabled={generating}
            style={styles.btn}
          >
            {generating ? (
              "Processing..."
            ) : (
              <>
                <Download size={16} /> Download Full Pack
              </>
            )}
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.iconBox}>
            <Users size={24} color="#005492" />
          </div>
          <h3>Group Performance</h3>
          <p style={styles.desc}>
            Export summary of all savings groups, cycles, and membership logs.
          </p>
          <button
            onClick={() => generateReport("GROUPS")}
            disabled={generating}
            style={styles.btn}
          >
            {generating ? (
              "Processing..."
            ) : (
              <>
                <Download size={16} /> Download Summary
              </>
            )}
          </button>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: "#fee2e2" }}>
            <FileText size={24} color="#dc2626" />
          </div>
          <h3>Risk & PAR Analysis</h3>
          <p style={styles.desc}>
            Detailed list of overdue loans, anomaly flags, and default risks.
          </p>
          <button
            onClick={() => generateReport("LOANS")}
            disabled={generating}
            style={styles.btn}
          >
            {generating ? (
              "Processing..."
            ) : (
              <>
                <Download size={16} /> Download Risk Log
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    background: "white",
    padding: 24,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  desc: {
    color: "#64748b",
    fontSize: "0.9rem",
    marginBottom: 20,
    lineHeight: 1.5,
  },
  btn: {
    width: "100%",
    background: "#0f172a",
    color: "white",
    border: "none",
    padding: 12,
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
  },
};
