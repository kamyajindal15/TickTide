import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";


const Report = () => {
    const [period, setPeriod] = useState(""); 
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(""); 
    const [reportData, setReportData] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        setStartDate(""); 
        setEndDate("");
    };


    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    
    const generateReport = async () => {
        if (!period && (!startDate || !endDate)) {
            alert("Please select a period or provide a valid date range.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const headers = {
                id: localStorage.getItem("id"),
                authorization: `Bearer ${localStorage.getItem("token")}`,
            };

            const requestData = period ? { period } : { startDate, endDate };

            const response = await axios.post(
                "http://localhost:1000/api/v2/generate-report",
                requestData,
                { headers }
            );

            setReportData(response.data.report);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError("Failed to generate the report. Please try again later.");
        }
    };

    const downloadPDF = () => {
        if (!reportData) {
            alert("Please generate a report first.");
            return;
        }
    
        const doc = new jsPDF();
    
        
        doc.setFontSize(18);
        doc.text("Task Report", 105, 20, null, null, "center");
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, null, null, "center");
    
       
        doc.setFontSize(12);
        doc.text(`Period: ${reportData.period}`, 20, 50);
        doc.text(`Start Date: ${reportData.startDate}`, 20, 60);
        doc.text(`End Date: ${reportData.endDate}`, 20, 70);
    
        doc.setFontSize(12);
        doc.text("Summary:", 20, 90);
        doc.text(`Total Tasks: ${reportData.totalTasks}`, 30, 100);
        doc.text(`Completed Tasks: ${reportData.completedTasks}`, 30, 110);
        doc.text(`Important Tasks: ${reportData.importantTasks}`, 30, 120);
    
        const tableColumns = ["No.", "Task Name", "Description", "Created On", "Completed", "Important"];
        const tableRows = reportData.tasks.map((task, index) => [
            index + 1,
            task.name,
            task.desc,
            task.createdAt,
            task.complete ? "Yes" : "No",
            task.important ? "Yes" : "No",
        ]);
    
        // Add the Table
        doc.autoTable({
            startY: 140,
            head: [tableColumns],
            body: tableRows,
            styles: {
                halign: "center", 
                valign: "middle", 
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [13, 43, 44], 
                textColor: [255, 255, 255], 
                fontSize: 12,
            },
            
            alternateRowStyles: {
                fillColor: [240, 240, 240], 
            },
            margin: { top: 10, bottom: 20 },
        });

        doc.save("task_report.pdf");
    };
    
    
    

    return (
        <div className="w-full px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d2b2c] mb-6 text-center">
                Generate Task Report
            </h1>

            
            <div className="flex flex-col items-center mb-6">
                <div className="flex mb-4">
                    <select
                        value={period}
                        onChange={handlePeriodChange}
                        className="bg-gray-700 text-white p-2 rounded mr-4"
                    >
                        <option value="">Select Period</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="6-months">Last 6 Months</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button
                        onClick={generateReport}
                        className="bg-gray-700 text-white p-2 rounded"
                    >
                        Generate Report
                    </button>
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <label>
                        Custom Start Date:
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="bg-gray-200 p-2 rounded ml-2"
                        />
                    </label>
                    <label>
                        Custom End Date:
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="bg-gray-200 p-2 rounded ml-2"
                        />
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Generating report...</div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : reportData ? (
                <div className="bg-gray-200 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
                    <div className="mb-4">
                        <p><strong>Total Tasks:</strong> {reportData.totalTasks}</p>
                        <p><strong>Completed Tasks:</strong> {reportData.completedTasks}</p>
                        <p><strong>Important Tasks:</strong> {reportData.importantTasks}</p>
                        <p><strong>Period:</strong> {reportData.period || "Custom Date Range"}</p>
                        <p><strong>From:</strong> {reportData.startDate}</p>
                        <p><strong>To:</strong> {reportData.endDate}</p>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 inline-block p-2 bg-blue-300 rounded-lg">
                        Task Details
                    </h3>
                    <ul className="space-y-4">
                        {reportData.tasks.map((task, index) => (
                            <li key={index} className="bg-gray-400 p-4 rounded-lg shadow">
                                <p><strong>Title:</strong> {task.name}</p>
                                <p><strong>Description:</strong> {task.desc}</p>
                                <p><strong>Created On:</strong> {task.createdAt}</p>
                                <p><strong>Completed:</strong> {task.complete ? "Yes" : "No"}</p>
                                <p><strong>Important:</strong> {task.important ? "Yes" : "No"}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 text-center">
                        <button
                            onClick={downloadPDF}
                            className="bg-[#5f9ea0] text-white p-2 rounded"
                        >
                            Download PDF
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">No report generated yet.</div>
            )}
        </div>
    );
};

export default Report;