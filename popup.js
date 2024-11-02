document.getElementById('openBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "performOpen" });
  window.close();
});
document.getElementById('downloadBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "performDownload" });
  window.close();
})