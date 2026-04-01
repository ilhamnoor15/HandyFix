(function () {
  const mount = document.getElementById("bookingFormMount");
  if (!mount) {
    return;
  }

  const escapeHtml = (value = "") => {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  let issueOptions = [];
  try {
    issueOptions = JSON.parse(mount.dataset.issueOptions || "[]");
  } catch (err) {
    issueOptions = [];
  }

  const fallbackOptions = [
    "Initial inspection & advice",
    "Urgent troubleshooting",
    "Replacement & repairs",
  ];

  const options = issueOptions.length ? issueOptions : fallbackOptions;
  const optionMarkup = options
    .map(
      (option) =>
        `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`,
    )
    .join("");

  const serviceName = mount.dataset.serviceName || "HandyFix service";

  mount.innerHTML = `
        <form id="bookingForm">
            <div class="step-container" id="step1">
                <h5 class="fw-bold mb-4"><i class="bi bi-1-circle-fill me-2 text-warning"></i> Describe the Issue</h5>
                <div class="mb-4">
                    <label class="form-label fw-bold">What service do you require?</label>
                    <select class="form-select border-2 p-3" id="serviceSelect" style="border-radius: 12px;" required>
                        <option value="" selected disabled>Select a service...</option>
                        ${optionMarkup}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="form-label fw-bold">Additional details</label>
                    <textarea class="form-control border-2 p-3" id="issueDetails" rows="3" style="border-radius: 12px; resize: none; height: 110px;" placeholder="Explain what you are experiencing" required></textarea>
                </div>
                <div class="mb-3 text-center">
                    <label class="form-label fw-bold d-block text-start">Add photos (Optional)</label>
                    <div id="imagePreviewContainer" class="mb-2 d-none">
                        <img id="imagePreview" src="#" alt="Preview" style="max-width: 100%; height: 150px; border-radius: 12px; object-fit: cover; border: 2px solid #E5A832;" />
                        <button type="button" id="removeImageBtn" class="btn btn-link text-danger small py-0">Remove photo</button>
                    </div>
                    <div id="uploadPlaceholder" class="border border-2 border-dashed d-flex flex-column align-items-center justify-content-center" style="border-radius: 12px; height: 150px; background-color: #fafafa; cursor: pointer;">
                        <i class="bi bi-camera-fill fs-1 text-muted mb-2"></i>
                        <span class="text-muted small fw-bold">Click to upload photo</span>
                    </div>
                    <input type="file" id="photoInput" class="d-none" accept="image/*">
                </div>
            </div>

            <div class="step-container d-none" id="step2">
                <h5 class="fw-bold mb-4"><i class="bi bi-2-circle-fill me-2 text-warning"></i> Preferred Schedule</h5>
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <label class="form-label fw-bold">Select Date</label>
                        <input type="text" class="form-control border-2 p-3" id="bookingDate" placeholder="dd/mm/yyyy" onfocus="this.type='date'" onblur="if (!this.value) this.type='text'" style="border-radius: 12px;" required>
                    </div>
                    <div class="col-md-6 mb-4">
                        <label class="form-label fw-bold">Preferred Time Slot</label>
                        <select class="form-select border-2 p-3" id="bookTime" style="border-radius: 12px;" required>
                            <option value="" selected disabled>Choose a time...</option>
                            <option>Morning (8:00 AM - 12:00 PM)</option>
                            <option>Afternoon (1:00 PM - 5:00 PM)</option>
                            <option>Evening (6:00 PM - 9:00 PM)</option>
                        </select>
                    </div>
                </div>
                <div class="p-3" style="background-color: #FFF9F0; border-radius: 12px; border: 1px solid #FFE0B2;">
                    <p class="m-0 small text-muted">
                        <i class="bi bi-info-circle-fill text-warning me-2"></i>
                        Note: Service hours follow HandyFix standard slots. For emergencies, pick the earliest available option.
                    </p>
                </div>
            </div>

            <div class="step-container d-none" id="step3">
                <h5 class="fw-bold mb-4"><i class="bi bi-3-circle-fill me-2 text-warning"></i> Service Address & Contact</h5>
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <label class="form-label fw-bold">Contact Number</label>
                        <div class="input-group">
                            <span class="input-group-text bg-white border-2 border-end-0" style="border-radius: 12px 0 0 12px;">+63</span>
                            <input type="tel" id="phoneInput" class="form-control border-2 border-start-0 p-3" placeholder="9XX XXX XXXX (loading)" style="border-radius: 0 12px 12px 0;" required>
                        </div>
                    </div>
                    <div class="col-md-6 mb-4">
                        <label class="form-label fw-bold">Landmark (Optional)</label>
                        <input type="text" id="landmarkInput" class="form-control border-2 p-3" placeholder="Brgy. hall, gate color, etc." style="border-radius: 12px;">
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-label fw-bold">Complete Address</label>
                    <textarea class="form-control border-2 p-3" id="address" rows="4" style="border-radius: 12px; resize: none;" placeholder="House #, Street, Barangay, City (Loading)" required></textarea>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="confirmData" required>
                    <label class="form-check-label small text-muted" for="confirmData">I confirm that the details provided are accurate.</label>
                </div>
            </div>

            <div class="step-container d-none" id="step4">
                <h5 class="fw-bold mb-4"><i class="bi bi-4-circle-fill me-2 text-warning"></i> Order Summary</h5>
                <div class="card border-0 bg-light p-4" style="border-radius: 15px;">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <p class="summary-label mb-1">SERVICE TYPE</p>
                            <p id="sumService" class="summary-value">---</p>
                        </div>
                        <div class="col-md-6">
                            <p class="summary-label mb-1">SCHEDULE</p>
                            <p id="sumSchedule" class="summary-value">---</p>
                        </div>
                        <div class="col-md-6">
                            <p class="summary-label mb-1">CONTACT</p>
                            <p id="sumContact" class="summary-value">---</p>
                        </div>
                        <div class="col-md-6">
                            <p class="summary-label mb-1">LANDMARK</p>
                            <p id="sumLandmark" class="summary-value">---</p>
                        </div>
                        <hr class="my-2 border-dashed">
                        <div class="col-md-12">
                            <p class="summary-label mb-1">SERVICE ADDRESS</p>
                            <p id="sumAddress" class="summary-value mb-0">---</p>
                        </div>
                        <div class="col-md-12 mt-3 pt-3 border-top">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">Initial Inspection Fee:</span>
                                <span class="fs-5 fw-bold text-success">&#8369;300.00</span>
                            </div>
                            <small class="text-muted fst-italic d-block text-end">*Labor and parts will be quoted after inspection.</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-secondary px-4 d-none" id="prevBtn">Back</button>
                <button type="button" class="btn btn-dark px-4 ms-auto" id="nextBtn" style="background-color: #4A0E0E; border: none;">Next Step</button>
                <button type="button" class="btn btn-warning px-4 d-none" id="submitBtn">Submit Request</button>
            </div>
        </form>

        <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                    <div class="modal-body text-center p-5">
                        <div class="mb-4">
                            <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                        </div>
                        <h3 class="fw-bold">Request Submitted!</h3>
                        <p class="text-muted" id="modalMessage">Your booking request has been sent.</p>
                        <button type="button" class="btn btn-dark px-5 py-2 mt-3" id="viewBookings" style="border-radius: 10px; background-color: #4A0E0E;">View My Bookings</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  const bookingForm = document.getElementById("bookingForm");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const pBar = document.getElementById("pBar");
  const totalSteps = 4;
  let currentStep = 1;

  const bookingDate = document.getElementById("bookingDate");
  const bookTime = document.getElementById("bookTime");
  const serviceSelect = document.getElementById("serviceSelect");
  const phoneInput = document.getElementById("phoneInput");
  const addressInput = document.getElementById("address");
  const landmarkInput = document.getElementById("landmarkInput");

  const modalElement = document.getElementById("successModal");
  const modalMessage = document.getElementById("modalMessage");
  const viewBookingsBtn = document.getElementById("viewBookings");
  const successModal =
    window.bootstrap && modalElement ? new bootstrap.Modal(modalElement) : null;

  const today = new Date().toISOString().split("T")[0];
  if (bookingDate) {
    bookingDate.setAttribute("min", today);
  }

  // Maps each time slot option label to its 24-hour start/end times
  const timeSlotMap = {
    "Morning (8:00 AM - 12:00 PM)": { low: "08:00", high: "12:00" },
    "Afternoon (1:00 PM - 5:00 PM)": { low: "13:00", high: "17:00" },
    "Evening (6:00 PM - 9:00 PM)": { low: "18:00", high: "21:00" },
  };

  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer",
  );
  const uploadPlaceholder = document.getElementById("uploadPlaceholder");
  const photoInput = document.getElementById("photoInput");
  const imagePreview = document.getElementById("imagePreview");
  const removeImageBtn = document.getElementById("removeImageBtn");

  async function fetchContractAdress() {
    console.log("Fetching contact/address...");
    const value = fetch("/api/fetchContactAddress", {
      method: "GET",
      credentials: "include",
    });
    value
      .then((res) => res.json())
      .then((data) => {
        console.log("Received contact/address:", data);
        if (data.contact_number) {
          phoneInput.value = data.contact_number;
        }
        if (data.address) {
          addressInput.value = data.address;
        }
      })
      .catch((err) => {
        console.error("Error fetching contact/address:", err);
      });
  }
  const updateDisplay = () => {
    console.log(`Updating display for step ${currentStep}/${totalSteps}`);

    if (currentStep === 3) {
      fetchContractAdress();
    }
    for (let step = 1; step <= totalSteps; step++) {
      const element = document.getElementById(`step${step}`);
      if (element) {
        element.classList.add("d-none");
      }
    }
    const activeStep = document.getElementById(`step${currentStep}`);
    if (activeStep) {
      activeStep.classList.remove("d-none");
    }
    if (pBar) {
      pBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    }
    if (prevBtn) {
      prevBtn.classList.toggle("d-none", currentStep === 1);
    }
    if (currentStep === totalSteps) {
      if (nextBtn) nextBtn.classList.add("d-none");
      if (submitBtn) submitBtn.classList.remove("d-none");
      populateSummary();
    } else {
      if (nextBtn) nextBtn.classList.remove("d-none");
      if (submitBtn) submitBtn.classList.add("d-none");
    }
  };

  const validateStep = (step) => {
    const container = document.getElementById(`step${step}`);
    if (!container) {
      return true;
    }
    const inputs = container.querySelectorAll(
      "input[required], select[required], textarea[required]",
    );
    let isValid = true;
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        if (!input.checked) {
          input.classList.add("is-invalid");
          isValid = false;
        } else {
          input.classList.remove("is-invalid");
        }
      } else if (!input.value) {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });
    return isValid;
  };

  const selectedIssueLabel = () => {
    const selected =
      serviceSelect && serviceSelect.value ? serviceSelect.value : "";
    return selected ? `${serviceName} – ${selected}` : serviceName;
  };

  const submitRequest = () => {
    if (!validateStep(currentStep)) {
      window.alert("Please fill the required fields before submitting.");
      return;
    }

    // Disable button to prevent double-submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";
    }

    const selectedSlot = timeSlotMap[bookTime.value] || {
      low: bookTime.value,
      high: bookTime.value,
    };

    fetch("/api/submitServiceRequest", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: serviceName,
        issue: selectedIssueLabel(),
        date: bookingDate.value,
        reservation_low: selectedSlot.low,
        reservation_high: selectedSlot.high,
        contact: phoneInput.value,
        address: addressInput.value,
        landmark: landmarkInput.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (modalMessage) {
            modalMessage.innerText =
              data.message ||
              `Your booking request for ${serviceName} has been sent.`;
          }
          if (successModal) {
            successModal.show();
          }
        } else {
          window.alert(
            data.message || "Failed to submit request. Please try again.",
          );
        }
      })
      .catch((error) => {
        console.error("Submission error:", error);
        window.alert("Failed to submit request. Please try again later.");
      })
      .finally(() => {
        // Re-enable button regardless of outcome
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit Request";
        }
      });
  };

  const populateSummary = () => {
    const summaryService = document.getElementById("sumService");
    const summarySchedule = document.getElementById("sumSchedule");
    const summaryContact = document.getElementById("sumContact");
    const summaryAddress = document.getElementById("sumAddress");
    const summaryLandmark = document.getElementById("sumLandmark");

    const bookingDateValue =
      bookingDate && bookingDate.value ? bookingDate.value : "Not set";
    const bookTimeValue =
      bookTime && bookTime.value ? bookTime.value : "Not set";
    const contactValue =
      phoneInput && phoneInput.value ? `+63 ${phoneInput.value}` : "Not set";
    const addressValue =
      addressInput && addressInput.value ? addressInput.value : "Not provided";
    const landmarkValue =
      landmarkInput && landmarkInput.value.trim()
        ? landmarkInput.value.trim()
        : "None provided";

    if (summaryService) {
      summaryService.innerText = selectedIssueLabel();
    }
    if (summarySchedule) {
      summarySchedule.innerText = `${bookingDateValue} | ${bookTimeValue}`;
    }
    if (summaryContact) {
      summaryContact.innerText = contactValue;
    }
    if (summaryAddress) {
      summaryAddress.innerText = addressValue;
    }
    if (summaryLandmark) {
      summaryLandmark.innerText = landmarkValue;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!validateStep(currentStep)) {
        window.alert("Please fill the required fields before proceeding.");
        return;
      }
      currentStep = Math.min(totalSteps, currentStep + 1);
      updateDisplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentStep = Math.max(1, currentStep - 1);
      updateDisplay();
    });
  }

  // Attach submitRequest directly to the Submit button
  if (submitBtn) {
    submitBtn.addEventListener("click", submitRequest);
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "").slice(0, 10);
    });
  }

  const resetImageUpload = () => {
    if (photoInput) {
      photoInput.value = "";
    }
    if (imagePreviewContainer) {
      imagePreviewContainer.classList.add("d-none");
    }
    if (uploadPlaceholder) {
      uploadPlaceholder.classList.remove("d-none");
    }
  };

  if (uploadPlaceholder && photoInput) {
    uploadPlaceholder.addEventListener("click", () => photoInput.click());
  }

  if (photoInput) {
    photoInput.addEventListener("change", () => {
      if (!photoInput.files || !photoInput.files.length) {
        resetImageUpload();
        return;
      }
      const file = photoInput.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (imagePreview) {
          imagePreview.src = event.target.result;
        }
        if (imagePreviewContainer) {
          imagePreviewContainer.classList.remove("d-none");
        }
        if (uploadPlaceholder) {
          uploadPlaceholder.classList.add("d-none");
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", () => resetImageUpload());
  }

  if (bookingForm) {
    bookingForm.addEventListener("input", () => {
      if (currentStep === totalSteps) {
        populateSummary();
      }
    });

    // Prevent native form submission — submitBtn is type="button" so this
    // only fires if the user somehow hits Enter inside the form.
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  if (viewBookingsBtn) {
    viewBookingsBtn.addEventListener("click", () => {
      window.location.href = "/user/bookings";
    });
  }

  updateDisplay();
})();
