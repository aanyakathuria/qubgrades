document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("loader").style.display = "block";

  setTimeout(() => {
    const studentName = document.getElementById("studentName").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const schoolName = document.getElementById("schoolName").value;
    const marksRaw = document.getElementById("marksInput").value;
    const marksList = marksRaw.split(',').map(m => m.trim());
    const marksHTML = marksList.map(m => `<li>${m}</li>`).join("");

    document.getElementById("studentNameDisplay").textContent = studentName;
    document.getElementById("rollNumberDisplay").textContent = "Roll No: " + rollNumber;
    document.getElementById("schoolNameDisplay").textContent = schoolName;
    document.getElementById("marksDisplay").innerHTML = marksHTML;

    document.getElementById("aiSummary").textContent =
      "Summary: " + generateMockSummary(marksList);

    // Generate Report ID & QR
    const reportID = "QUB" + Math.floor(Math.random() * 1000000);
    window.currentReportID = reportID;
    document.getElementById("qrCode").innerHTML = "";
    new QRCode(document.getElementById("qrCode"), {
      text: reportID,
      width: 128,
      height: 128
    });
    document.getElementById("reportIDDisplay").textContent = "Report ID: " + reportID;

    // Upload Logo
    const logoInput = document.getElementById("logoUpload");
    if (logoInput.files && logoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById("schoolLogo").src = e.target.result;
      };
      reader.readAsDataURL(logoInput.files[0]);
    }

    // Show Report
    const reportCard = document.getElementById("reportCard");
    reportCard.style.display = "block";
    reportCard.style.animation = "none";
    void reportCard.offsetWidth;
    reportCard.style.animation = "fadeInUp 0.8s ease-out forwards";

    document.getElementById("loader").style.display = "none";
  }, 800);
});

function generateMockSummary(marks) {
  const avg = marks.reduce((acc, m) => {
    const num = parseInt(m.split(':')[1]);
    return acc + (isNaN(num) ? 0 : num);
  }, 0) / marks.length;
  if (avg >= 90) return "Outstanding performance!";
  if (avg >= 75) return "Excellent work!";
  if (avg >= 60) return "Good job!";
  return "Needs improvement.";
}

function downloadPDF() {
  const element = document.getElementById("reportCard");
  html2pdf().from(element).save("QubGrades_Report.pdf");
}

function downloadImage() {
  const element = document.getElementById("reportCard");
  html2canvas(element).then(canvas => {
    const link = document.createElement("a");
    link.download = "QubGrades_Report.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function verifyReport() {
  const input = document.getElementById("verifyInput").value;
  const resultBox = document.getElementById("verifyResult");
  if (input === window.currentReportID) {
    resultBox.textContent = "✅ Report Verified!";
    resultBox.style.color = "green";
  } else {
    resultBox.textContent = "❌ Report ID Invalid or does not match.";
    resultBox.style.color = "red";
  }
}
