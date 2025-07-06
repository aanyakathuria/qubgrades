document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Show loader
  const loader = document.getElementById("loader");
  loader.style.display = "block";

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

    const reportID = "QUB" + Math.floor(Math.random() * 1000000);
    window.currentReportID = reportID;
    document.getElementById("reportIDDisplay").textContent = reportID;

    // Generate QR
    document.getElementById("qrCode").innerHTML = "";
    new QRCode(document.getElementById("qrCode"), {
      text: reportID,
      width: 128,
      height: 128
    });

    // Upload logo
    const logoInput = document.getElementById("logoUpload");
    if (logoInput.files && logoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById("schoolLogo").src = e.target.result;
      };
      reader.readAsDataURL(logoInput.files[0]);
    } else {
      document.getElementById("schoolLogo").src = "assets/default-logo.png";
    }

    // Show report card
    const reportCard = document.getElementById("reportCard");
    reportCard.style.display = "block";
    reportCard.style.animation = "none";
    void reportCard.offsetWidth;
    reportCard.style.animation = "fadeInUp 0.8s ease-out forwards";

    // Hide loader
    loader.style.display = "none";
  }, 1000);
});

// 🖊️ Edit Report
function editReport() {
  document.getElementById("reportCard").style.display = "none";
  document.getElementById("reportForm").scrollIntoView({ behavior: "smooth" });
}

// 📄 Download PDF
function downloadPDF() {
  const element = document.getElementById("reportCard");
  html2pdf().from(element).save("QubGrades_Report.pdf");
}

// 🖼️ Download Image
function downloadImage() {
  const element = document.getElementById("reportCard");
  html2canvas(element).then(canvas => {
    const link = document.createElement("a");
    link.download = "QubGrades_Report.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// 🤖 AI Summary Logic
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

// ✅ Verify Report
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
