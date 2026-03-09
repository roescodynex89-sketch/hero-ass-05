// id dhori
const issuesContainer = document.getElementById("issues-container");
const issueCountTotal = document.getElementById("issue-count");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("empty-state");

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");

let allIssues = [];

// load>api
async function loadIssues() {
  loading.classList.remove("hidden");

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );

  const data = await res.json();

  allIssues = data.data;

  displayIssues(allIssues);
}

loadIssues();

function displayIssues(issues) {
  issuesContainer.innerHTML = "";

  loading.classList.add("hidden");

  if (issues.length === 0) {
    emptyState.classList.remove("hidden");

    issuesContainer.classList.add("hidden");

    return;
  }

  emptyState.classList.add("hidden");
  issuesContainer.classList.remove("hidden");
  issuesContainer.classList.add("grid");

  issueCountTotal.innerText = issues.length;
  // card edit
  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer";

    // priority condition
    if (issue.status === "open") {
      card.style.borderTop = "4px solid #22c55e";
      card.style.borderBottom = "2px solid #F3F4F6 ";
    } else {
      card.style.borderTop = "4px solid #9333ea";
      card.style.borderBottom = "2px solid #F3F4F6";
    }

    //icon set
    //  const statusIcon =
    //     issue.status === "open"
    //       ? `<img src="assets/Closed- Status .png" class="w-7 h-7"/>`
    //       : ` <img src="assets/Open-Status.png" class="w-7 h-7"/>`;

    const statusIcon =
      issue.status === "open"
        ? ` <img src="assets/Open-Status.png" class="w-7 h-7"/>`
        : `<img src="assets/Closed- Status .png" class="w-7 h-7"/>`;

    // style
    const priorityClass =
      issue.priority === "high"
        ? "bg-red-100 text-red-500"
        : issue.priority === "medium"
          ? "bg-orange-100 text-orange-500"
          : "bg-blue-100 text-blue-400";

    // low=enhance high/medium
    const labelsHTML =
      issue.priority === "low"
        ? `<span class="text-xs border border-purple-200 text-purple-600 px-3 py-1 rounded-full">ENHANCEMENT</span>`
        : ` <span class="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-full">BUG</span>
        <span class="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-full">HELP WANTED</span>

       `;

    const date = new Date(issue.createdAt).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    card.innerHTML = `
    <div class="flex justify-between items-center mb-3">
      ${statusIcon}
      <span class="text-xs font-bold px-3 py-1 rounded-full ${priorityClass}">
        ${issue.priority.toUpperCase()}
      </span>
    </div>

    <h3 class="font-bold text-sm text-gray-900 mb-2">
      ${issue.title}
    </h3>

    <p class="text-xs text-gray-400 mb-4 leading-relaxed"
    style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
      ${issue.description}
    </p>

    <div class="flex flex-wrap gap-2 mb-4">${labelsHTML}</div>

    <div class="border-t border-gray-100 pt-3">
      <p class="text-xs text-gray-400">#${issue.id} by <span class="font-medium">${issue.author}</span></p>
      <p class="text-xs text-gray-400 mt-1">${date}</p>
    </div>
    `;

    card.addEventListener("click", () => openModal(issue));
    issuesContainer.appendChild(card);
  });
}

// button
function setActiveTab(btn) {
  allBtn.classList.remove("bg-blue-600", "text-white");
  openBtn.classList.remove("bg-blue-600", "text-white");
  closedBtn.classList.remove("bg-blue-600", "text-white");

  btn.classList.add("bg-blue-600", "text-white");
}

function switchTab(type) {
  if (type === "all") {
    setActiveTab(allBtn);
    displayIssues(allIssues);
  }

  if (type === "open") {
    setActiveTab(openBtn);

    const openIssues = allIssues.filter((issue) => issue.status === "open");

    displayIssues(openIssues);
  }

  if (type === "closed") {
    setActiveTab(closedBtn);

    const closedIssues = allIssues.filter((issue) => issue.status === "closed");

    displayIssues(closedIssues);
  }
}
// search..tab
async function searchIssue() {
  const text = document.getElementById("search-input").value.trim();

  if (text === "") {
    displayIssues(allIssues);
    return;
  }

  const res = await fetch(`
https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);

  const data = await res.json();

  displayIssues(data.data);
}
// pop edit
function openModal(issue) {
  const modal = document.getElementById("issue-modal");
  document.getElementById("modal-title").innerText = issue.title;
  document.getElementById("modal-desc").innerText = issue.description;
  document.getElementById("modal-author").innerText = issue.author;
  document.getElementById("modal-date").innerText = new Date(
    issue.createdAt,
  ).toLocaleDateString();
  document.getElementById("modal-assignee").innerText =
    issue.assignee || "Not assignee";

  const priorityEl = document.getElementById("modal-priority");
  const priority = issue.priority ? issue.priority.toLowerCase() : "";
  priorityEl.innerText = issue.priority.toUpperCase();

  if (priority === "high" || priority === "medium") {
    priorityEl.style.backgroundColor = "#e5e7eb";
    priorityEl.style.color = "#ef4444";
    priorityEl.style.borderRadius = "4px";
    priorityEl.style.padding = "2px";
  } else {
    priorityEl.style.backgroundColor = "#e5e7eb";
    priorityEl.style.color = "#0ea5e9";
    priorityEl.style.borderRadius = "4px";
    priorityEl.style.padding = "2px";
  }

  const statusEl = document.getElementById("modal-status");
  statusEl.innerText = issue.status;
  statusEl.style.backgroundColor =
    issue.status === "open" ? "#22c55e" : "#9333ea";

  const labelsContainer = document.getElementById("modal-labels");
  if (priority === "low") {
    labelsContainer.innerHTML = `
            <span class="text-xs border border-purple-200 text-purple-600 px-3 py-1 rounded-full">ENHANCEMENT</span>`;
  } else {
    labelsContainer.innerHTML = `
            <span class="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-full">BUG</span>
            <span class="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-full">HELP WANTED</span>`;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  const modal = document.getElementById("issue-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}
