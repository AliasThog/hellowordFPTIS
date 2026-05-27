const APP_CONFIG = {
  eventsUrl: "./data/events.json",
  defaultImage: "./assests/event-default.jpg",
  storageKey: "campus-event-explorer-user-events",
  mockLoadingTime: 500,
};

const state = {
  baseEvents: [],
  userEvents: [],
  searchText: "",
  selectedCategory: "All",
  currentPage: "explore",
  loading: false,
  feedback: {
    message: "",
    type: "info",
  },
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  bindEvents();
  hideValidationAlert();
  loadInitialData();
}

function cacheElements() {
  elements.alert = document.querySelector("#networkAlert");
  elements.closeAlertBtn = document.querySelector("#closeAlertBtn");
  elements.alertMessage = document.querySelector("#alertMessage");

  elements.navLinks = document.querySelectorAll(".nav-link");

  elements.heroCard = document.querySelector(".hero-card");
  elements.eventsSection = document.querySelector(".events-section");
  elements.quickAddCard = document.querySelector(".quick-add-card");
  elements.sectionTitle = document.querySelector(".section-title-row h2");
  elements.calendarLink = document.querySelector(".calendar-link");

  elements.searchInput = document.querySelector("#searchInput");
  elements.searchBtn = document.querySelector("#searchBtn");
  elements.chips = document.querySelectorAll(".chip");

  elements.eventGrid = document.querySelector("#eventGrid");
  elements.loadingState = document.querySelector("#loadingState");
  elements.emptyState = document.querySelector("#emptyState");
  elements.feedbackMessage = document.querySelector("#feedbackMessage");

  elements.form = document.querySelector("#eventForm");
  elements.eventName = document.querySelector("#eventName");
  elements.eventCategory = document.querySelector("#eventCategory");
  elements.eventDate = document.querySelector("#eventDate");
  elements.eventTime = document.querySelector("#eventTime");
  elements.eventLocation = document.querySelector("#eventLocation");
  elements.formErrors = document.querySelector("#formErrors");
}

function bindEvents() {
  elements.closeAlertBtn?.addEventListener("click", handleCloseAlert);

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  elements.searchInput?.addEventListener("input", handleSearchInput);
  elements.searchBtn?.addEventListener("click", renderApp);

  elements.chips.forEach((chip) => {
    chip.addEventListener("click", handleCategoryChipClick);
  });

  elements.form?.addEventListener("submit", handleCreateEvent);
}

async function loadInitialData() {
  state.loading = true;
  renderApp();

  try {
    await delay(APP_CONFIG.mockLoadingTime);

    const response = await fetch(APP_CONFIG.eventsUrl);

    if (!response.ok) {
      throw new Error("Cannot load data/events.json");
    }

    const eventsFromJson = await response.json();

    if (!Array.isArray(eventsFromJson)) {
      throw new Error("events.json must be an array");
    }

    state.baseEvents = eventsFromJson.map(normalizeEvent);
    state.userEvents = loadUserEventsFromStorage();

    setFeedback("Events loaded successfully.", "success");
  } catch (error) {
    console.error(error);

    state.baseEvents = [];
    state.userEvents = loadUserEventsFromStorage();

    setFeedback(
      "Could not load events.json. Please check the file path and run with Live Server.",
      "error",
    );
  } finally {
    state.loading = false;
    renderApp();
  }
}

function normalizeEvent(eventItem) {
  const category =
    eventItem.category || getFirstCategory(eventItem) || "General";

  const categories =
    Array.isArray(eventItem.categories) && eventItem.categories.length > 0
      ? eventItem.categories
      : [category];

  return {
    id: eventItem.id || crypto.randomUUID(),
    title: String(eventItem.title || "Untitled Event").trim(),
    date: eventItem.date || "",
    time: eventItem.time || "",
    dateText:
      eventItem.dateText || formatEventDateTime(eventItem.date, eventItem.time),
    location: String(eventItem.location || "Location not available").trim(),
    category,
    categories,
    capacity: Number(eventItem.capacity) || 0,
    status: eventItem.status || "Open",
    price: eventItem.price || "",
    image: eventItem.image || APP_CONFIG.defaultImage,
    createdByUser: Boolean(eventItem.createdByUser),
  };
}

function getFirstCategory(eventItem) {
  if (Array.isArray(eventItem.categories) && eventItem.categories.length > 0) {
    return eventItem.categories[0];
  }

  return "";
}

function getAllEvents() {
  return [...state.userEvents, ...state.baseEvents];
}

function handleCloseAlert() {
  hideValidationAlert();
}

function handleNavClick(event) {
  event.preventDefault();

  const clickedLink = event.currentTarget;
  const page = clickedLink.dataset.page || "explore";

  state.currentPage = page;

  elements.navLinks.forEach((link) => {
    link.classList.toggle("active", link === clickedLink);
  });

  clearFeedback();
  renderApp();
}

function handleSearchInput() {
  state.searchText = elements.searchInput.value.trim().toLowerCase();
  renderApp();
}

function handleCategoryChipClick(event) {
  const clickedChip = event.currentTarget;

  elements.chips.forEach((chip) => {
    chip.classList.remove("active");
  });

  clickedChip.classList.add("active");

  state.selectedCategory = clickedChip.dataset.category || "All";

  renderApp();
}

function handleCreateEvent(event) {
  event.preventDefault();

  const formData = getFormData();
  const errors = validateEventForm(formData);

  if (errors.length > 0) {
    showValidationAlert(errors);
    showFormErrors(errors);
    clearFeedback();
    return;
  }

  const newEvent = normalizeEvent({
    id: crypto.randomUUID(),
    title: formData.title,
    date: formData.date,
    time: formData.time,
    dateText: formatEventDateTime(formData.date, formData.time),
    location: formData.location,
    category: formData.category,
    categories: [formData.category],
    capacity: 30,
    status: "Open",
    price: "",
    image: APP_CONFIG.defaultImage,
    createdByUser: true,
  });

  state.userEvents = [newEvent, ...state.userEvents];
  saveUserEventsToStorage();

  elements.form.reset();
  clearFormErrors();
  hideValidationAlert();

  state.currentPage = "my-events";
  setActiveNav("my-events");

  setFeedback(
    "Event created successfully. It was added to My Events.",
    "success",
  );
  renderApp();
}

function getFormData() {
  return {
    title: elements.eventName.value.trim(),
    category: elements.eventCategory.value,
    date: elements.eventDate.value,
    time: elements.eventTime.value,
    location: elements.eventLocation.value.trim(),
  };
}

function validateEventForm(data) {
  const errors = [];

  if (!data.title) {
    errors.push("Event name is required.");
  }

  if (!data.category) {
    errors.push("Category is required.");
  }

  if (!data.date) {
    errors.push("Date is required.");
  }

  if (!data.time) {
    errors.push("Time is required.");
  }

  if (!data.location) {
    errors.push("Location is required.");
  }

  if (data.date && Number.isNaN(new Date(data.date).getTime())) {
    errors.push("Date must be valid.");
  }

  return errors;
}

function renderApp() {
  renderFeedback();

  if (state.currentPage === "my-events") {
    renderMyEventsPage();
    return;
  }

  if (state.currentPage === "help") {
    renderHelpPage();
    return;
  }

  renderExplorePage();
}

function renderExplorePage() {
  setMainLayoutVisible({
    showHero: true,
    showQuickAdd: true,
    showEvents: true,
  });

  setSectionHeader("Upcoming Events", true);

  const filteredEvents = filterEvents(getAllEvents());

  renderListState({
    events: filteredEvents,
    emptyMessage: "No events found. Try another search or category.",
  });
}

function renderMyEventsPage() {
  setMainLayoutVisible({
    showHero: false,
    showQuickAdd: false,
    showEvents: true,
  });

  setSectionHeader("My Events", false);

  renderListState({
    events: state.userEvents,
    emptyMessage: "You have not created any events yet.",
  });
}

function renderHelpPage() {
  setMainLayoutVisible({
    showHero: false,
    showQuickAdd: false,
    showEvents: true,
  });

  setSectionHeader("Help", false);

  elements.loadingState.hidden = true;
  elements.emptyState.hidden = true;
  elements.eventGrid.hidden = false;

  elements.eventGrid.innerHTML = `
    <article class="event-card help-card">
      <div class="event-body">
        <h3>How to use Campus Event Explorer</h3>

        <div class="event-meta">
          <div class="meta-line">
            <span class="meta-icon">1</span>
            <span>Use the search box to find events by title, category, or location.</span>
          </div>

          <div class="meta-line">
            <span class="meta-icon">2</span>
            <span>Use category chips to filter events quickly.</span>
          </div>

          <div class="meta-line">
            <span class="meta-icon">3</span>
            <span>Use Quick Add Event to create a local demo event.</span>
          </div>

          <div class="meta-line">
            <span class="meta-icon">4</span>
            <span>Events from events.json are read-only. Created events are stored in localStorage.</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderListState({ events, emptyMessage }) {
  elements.loadingState.hidden = !state.loading;

  elements.emptyState.textContent = emptyMessage;
  elements.emptyState.hidden = state.loading || events.length > 0;

  elements.eventGrid.hidden = state.loading || events.length === 0;

  if (state.loading) {
    elements.eventGrid.innerHTML = "";
    return;
  }

  renderEvents(events);
}

function renderEvents(events) {
  elements.eventGrid.innerHTML = events.map(createEventCardHtml).join("");
}

function createEventCardHtml(eventItem) {
  const tagsHtml = eventItem.categories
    .map((category) => {
      return `<span class="tag ${getTagClass(category)}">${escapeHtml(category)}</span>`;
    })
    .join("");

  const priceHtml = eventItem.price
    ? `<span class="price-badge">${escapeHtml(eventItem.price)}</span>`
    : "";

  return `
    <article class="event-card">
      <div class="event-image">
        <img
          src="${escapeAttribute(eventItem.image)}"
          alt="${escapeAttribute(eventItem.title)}"
          loading="lazy"
          onerror="this.src='${APP_CONFIG.defaultImage}'"
        />
        ${priceHtml}
      </div>

      <div class="event-body">
        <div class="tag-row">
          ${tagsHtml}
        </div>

        <h3>${escapeHtml(eventItem.title)}</h3>

        <div class="event-meta">
          <div class="meta-line">
            <span class="meta-icon">◷</span>
            <span>${escapeHtml(eventItem.dateText || "Time not available")}</span>
          </div>

          <div class="meta-line">
            <span class="meta-icon">⌖</span>
            <span>${escapeHtml(eventItem.location)}</span>
          </div>

          <div class="meta-line">
            <span class="meta-icon">◉</span>
            <span>${escapeHtml(eventItem.status)} · ${eventItem.capacity} seats</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function filterEvents(events) {
  return events.filter((eventItem) => {
    const searchableText = [
      eventItem.title,
      eventItem.location,
      eventItem.status,
      eventItem.category,
      ...eventItem.categories,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(state.searchText);

    const matchesCategory =
      state.selectedCategory === "All" ||
      eventItem.categories.includes(state.selectedCategory) ||
      eventItem.category === state.selectedCategory;

    return matchesSearch && matchesCategory;
  });
}

function setMainLayoutVisible({ showHero, showQuickAdd, showEvents }) {
  elements.heroCard.hidden = !showHero;
  elements.quickAddCard.hidden = !showQuickAdd;
  elements.eventsSection.hidden = !showEvents;
}

function setSectionHeader(title, showCalendarLink) {
  elements.sectionTitle.textContent = title;
  elements.calendarLink.hidden = !showCalendarLink;
}

function setActiveNav(page) {
  elements.navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });
}

function showFormErrors(errors) {
  elements.formErrors.hidden = false;

  elements.formErrors.innerHTML = `
    <strong>Please fix:</strong>
    <ul>
      ${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}
    </ul>
  `;
}

function clearFormErrors() {
  elements.formErrors.hidden = true;
  elements.formErrors.innerHTML = "";
}

function setFeedback(message, type = "info") {
  state.feedback.message = message;
  state.feedback.type = type;
}

function clearFeedback() {
  state.feedback.message = "";
  state.feedback.type = "info";
  renderFeedback();
}

function renderFeedback() {
  if (!elements.feedbackMessage) {
    return;
  }

  if (!state.feedback.message) {
    elements.feedbackMessage.hidden = true;
    elements.feedbackMessage.textContent = "";
    elements.feedbackMessage.className = "feedback-message";
    return;
  }

  elements.feedbackMessage.hidden = false;
  elements.feedbackMessage.textContent = state.feedback.message;
  elements.feedbackMessage.className = `feedback-message feedback-${state.feedback.type}`;
}

function saveUserEventsToStorage() {
  localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(state.userEvents));
}

function loadUserEventsFromStorage() {
  try {
    const rawData = localStorage.getItem(APP_CONFIG.storageKey);

    if (!rawData) {
      return [];
    }

    const parsedEvents = JSON.parse(rawData);

    if (!Array.isArray(parsedEvents)) {
      return [];
    }

    return parsedEvents.map(normalizeEvent);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function formatEventDateTime(date, time) {
  if (!date || !time) {
    return "";
  }

  const dateObject = new Date(`${date}T${time}`);

  if (Number.isNaN(dateObject.getTime())) {
    return "Date not available";
  }

  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).format(dateObject);

  const timeLabel = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(dateObject);

  return `${dateLabel}, ${timeLabel}`;
}

function getTagClass(category) {
  return `tag-${String(category).toLowerCase().replaceAll(" ", "-")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function showValidationAlert(errors) {
  if (!elements.alert || !elements.alertMessage) {
    return;
  }

  elements.alert.hidden = false;

  elements.alertMessage.innerHTML = errors
    .map((error) => `<li>${escapeHtml(error)}</li>`)
    .join("");

  elements.alert.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function hideValidationAlert() {
  if (!elements.alert || !elements.alertMessage) {
    return;
  }

  elements.alert.hidden = true;
  elements.alertMessage.innerHTML = "";
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
