document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // BASIC ELEMENTS
    // =========================
    const createPopup = document.getElementById("create-post-popup");
    const closePopup = document.getElementById("close-create-popup");
    const cancelCreate = document.getElementById("cancel-create");
    const form = document.getElementById("new-post-form");
    const cardContainer = document.querySelector(".content-card-post");

    const clockicon = "assets/icon/clock.png";

    const totalPosts = document.querySelector(".total-posts h1");
    const drafts = document.querySelector(".drafts h1");
    const scheduled = document.querySelector(".scheduled h1");
    const published = document.querySelector(".published h1");

    const fileInput = document.getElementById("file-input");
    const filePlaceholder = document.querySelector(".file-placeholder");

    const dateInput = document.getElementById("date-input");
    const datePlaceholder = document.querySelector(".date-placeholder");


    // =========================
    // SIDEBAR
    // =========================
    const sidebar = document.getElementById("sidebar");
    const sidebarIcon = document.getElementById("sidebaricon");
    const mainHeader = document.querySelector(".content-header");
    const mainContent = document.querySelector(".main-content");
    const overlay = document.getElementById("overlay");

    let sidebarOpen = true;

    function setInitialSidebarState() {
        if (window.innerWidth <= 768) {
            sidebarOpen = false;
            sidebar.style.left = "-240px";
            sidebarIcon.style.left = "20px";
            mainHeader.style.marginLeft = "0";
            if (mainContent) mainContent.style.marginLeft = "0";
            overlay.style.display = "none";
        } else {
            sidebarOpen = true;
            sidebar.style.left = "0";
            sidebarIcon.style.left = "240px";
            mainHeader.style.marginLeft = "240px";
            if (mainContent) mainContent.style.marginLeft = "240px";
            overlay.style.display = "none";
        }
    }

    setInitialSidebarState();
    window.addEventListener("resize", setInitialSidebarState);

    sidebarIcon.addEventListener("click", () => {
        sidebarOpen = !sidebarOpen;

        if (sidebarOpen) {
            sidebar.style.left = "0";

            if (window.innerWidth <= 768) {
                overlay.style.display = "block";
            } else {
                sidebarIcon.style.left = "240px";
                mainHeader.style.marginLeft = "240px";
                if (mainContent) mainContent.style.marginLeft = "240px";
            }

        } else {
            sidebar.style.left = "-240px";
            sidebarIcon.style.left = "20px";

            mainHeader.style.marginLeft = "0";
            if (mainContent) mainContent.style.marginLeft = "0";

            overlay.style.display = "none";
        }
    });

    overlay.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sidebar.style.left = "-240px";
            sidebarIcon.style.left = "20px";
            overlay.style.display = "none";
            sidebarOpen = false;
        }
    });


    // =========================
    // FILE INPUT
    // =========================
    fileInput.addEventListener("change", () => {
        const fileName = fileInput.files[0]?.name || "Upload media";
        filePlaceholder.textContent = fileName;
        filePlaceholder.style.color = "#000";
    });


    // =========================
    // DATE INPUT
    // =========================
    dateInput.addEventListener("change", () => {
        if (dateInput.value) {
            const dateObj = new Date(dateInput.value);

            const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });

            datePlaceholder.textContent = formattedDate;
            datePlaceholder.style.color = "#000";
            datePlaceholder.classList.add("active");
        }
    });


    // =========================
    // CREATE POST POPUP
    // =========================
    document.getElementById("create-post").addEventListener("click", () => {
        createPopup.style.display = "flex";
    });

    closePopup.onclick = () => createPopup.style.display = "none";
    cancelCreate.onclick = () => createPopup.style.display = "none";

    window.addEventListener("click", (e) => {
        if (e.target === createPopup) {
            createPopup.style.display = "none";
        }
    });


    // =========================
    // LOAD SAVED POSTS
    // =========================
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.forEach(renderPost);
    }

    loadPosts();


    // =========================
    // RENDER POST
    // =========================
    function renderPost(post) {
        const postHTML = `
        <div class="published-post">
            <img src="${post.imageURL}">
            
            <div class="social-media">
                <img src="assets/icon/${post.platform}.png">
                <h1>...</h1>
            </div>

            <p>${post.content}</p>

            <div class="more-detail">
                <h3 class="${post.statusClass}">${post.status}</h3>
                <p><img src="${clockicon}" class="clock-icon"> ${post.formattedDate}</p>
            </div>
        </div>`;

        cardContainer.insertAdjacentHTML("afterbegin", postHTML);
    }

// =========================
// FULLCALENDAR INITIALIZATION
// =========================
const calendarView = document.getElementById("calendarView");
const calendarEl = document.getElementById("calendar");

const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",

    eventDidMount: function(info) {
        const cell = info.el.closest(".fc-daygrid-day");
        if (cell) cell.style.backgroundColor = "#ffe8c6";

        info.el.title =
            `Content: ${info.event.extendedProps.content}\n` +
            `Status: ${info.event.extendedProps.status}`;
    },

    // ✅ FIXED dateClick function
    dateClick: function(info) {
        showEventsForDate(info.dateStr);
    }
});


// =========================
// SHOW EVENTS ON DATE CLICK
// =========================
function showEventsForDate(dateStr) {
    const events = calendar.getEvents().filter(ev => ev.startStr === dateStr);

    const popup = document.getElementById("eventPopup");
    const detailsBox = document.getElementById("eventDetails");

    if (events.length === 0) {
        detailsBox.innerHTML = "<p>No events on this date.</p>";
        popup.style.display = "flex";
        return;
    }

    // build HTML list
    let html = `<p><strong>Date:</strong> ${dateStr}</p>`;

    events.forEach((ev, index) => {
        html += `
            <div class="event-item">
                <h4>${index + 1}. ${ev.title}</h4>
                <p><strong>Content:</strong> ${ev.extendedProps.content}</p>
                <p><strong>Status:</strong> ${ev.extendedProps.status}</p>
                <hr>
            </div>
        `;
    });

    detailsBox.innerHTML = html;

    popup.style.display = "flex";
}


document.getElementById("closeEventPopup").onclick = function() {
    document.getElementById("eventPopup").style.display = "none";
};

window.onclick = function(e) {
    if (e.target === document.getElementById("eventPopup")) {
        document.getElementById("eventPopup").style.display = "none";
    }
};


// =========================
// LOAD STORED POSTS INTO CALENDAR
// =========================
let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];

storedPosts.forEach(post => {
    if (post.calendarDate) {
        calendar.addEvent({
            title: `${post.platform.toUpperCase()} - ${post.status}`,
            date: post.calendarDate,
            extendedProps: {
                content: post.content,
                status: post.status,
                statusClass: post.statusClass
            }
        });
    }
});

calendar.render();


// =========================
// FORM SUBMIT
// =========================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const platform = form.querySelector("select").value.toLowerCase();
    const content = form.querySelector("textarea").value;
    const date = dateInput.value;

    let imageURL = fileInput.files.length > 0
        ? URL.createObjectURL(fileInput.files[0])
        : "assets/icon/default-img.png";

    let formattedDate = "No date";
    let calendarDate = null;

    if (date) {
        const dateObj = new Date(date);
        formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        calendarDate = dateObj.toISOString().split("T")[0];
    }

    // STATUS LOGIC
    let status, statusClass;

    if (!date) {
        status = "Draft";
        statusClass = "draft";
        drafts.innerText = +drafts.innerText + 1;
    } else {
        const today = new Date();
        const selected = new Date(date);

        if (selected > today) {
            status = "Scheduled";
            statusClass = "schedule";
            scheduled.innerText = +scheduled.innerText + 1;
        } else {
            status = "Published";
            statusClass = "published";
            published.innerText = +published.innerText + 1;
        }
    }

    totalPosts.innerText = +totalPosts.innerText + 1;

    const postData = {
        imageURL,
        platform,
        content,
        status,
        statusClass,
        formattedDate,
        calendarDate
    };

    // SAVE TO LOCALSTORAGE
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(postData);
    localStorage.setItem("posts", JSON.stringify(posts));

    // DISPLAY IN GRID
    renderPost(postData);

    // ADD TO CALENDAR
    if (calendarDate) {
        calendar.addEvent({
            title: `${platform.toUpperCase()} - ${status}`,
            date: calendarDate,
            extendedProps: {
                content,
                status,
                statusClass
            }
        });
    }

    // RESET FORM
    createPopup.style.display = "none";
    form.reset();

    filePlaceholder.textContent = "Upload media";
    filePlaceholder.style.color = "#888";

    datePlaceholder.textContent = "Pick a date";
    datePlaceholder.style.color = "#888";
    datePlaceholder.classList.remove("active");
});


    




    // =========================
    // TAB SWITCHING — FIXED
    // =========================

    const gridView = document.getElementById("gridView");
    const openCalendarBtn = document.getElementById("openCalendarBtn");
    const openGridBtn = document.getElementById("openGridBtn");

    openCalendarBtn.addEventListener("click", () => {
        gridView.style.display = "none";
        calendarView.style.display = "block";
        setTimeout(() => calendar.render(), 20);
    });

    openGridBtn.addEventListener("click", () => {
        calendarView.style.display = "none";
        gridView.style.display = "block";
    });


const gridBtn = document.getElementById("openGridBtn");
const calendarBtn = document.getElementById("openCalendarBtn");

gridBtn.addEventListener("click", () => {
    gridBtn.classList.add("active");
    calendarBtn.classList.remove("active");
});

calendarBtn.addEventListener("click", () => {
    calendarBtn.classList.add("active");
    gridBtn.classList.remove("active");
});


});
