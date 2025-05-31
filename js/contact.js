// Import the updated Supabase client
import supabase from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Contact page loaded");
  
  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({
      "aria-hidden": "true",
      "stroke-width": 2,
      "color": "currentColor",
      "size": 24
    });
  }

  // FAQ toggle functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const toggleBtn = item.querySelector('.toggle-btn');
    const question = item.querySelector('.faq-question');
    
    // Make both the button and the question clickable
    [toggleBtn, question].forEach(el => {
      el.addEventListener('click', (e) => {
        // Prevent event bubbling if clicking on the question
        if (el === question && e.target === toggleBtn) {
          return;
        }
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const icon = otherItem.querySelector('.toggle-btn svg');
            feather.replace(icon, { name: 'chevron-down' });
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        const icon = item.querySelector('.toggle-btn svg');
        if (item.classList.contains('active')) {
          feather.replace(icon, { name: 'chevron-up' });
        } else {
          feather.replace(icon, { name: 'chevron-down' });
        }
      });
    });
  });

  // Form validation and submission
  const contactForm = document.getElementById("contact-form");
  const submitBtn = contactForm.querySelector(".submit-btn");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let isValid = true;

    // Reset error messages
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    // Name validation
    const name = document.getElementById("name");
    if (name.value.trim() === "") {
      document.getElementById("name-error").textContent = "Name is required";
      isValid = false;
    }

    // Email validation
    const email = document.getElementById("email");
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      document.getElementById("email-error").textContent =
        "Please enter a valid email address";
      isValid = false;
    }

    // Subject validation
    const subject = document.getElementById("subject");
    if (subject.value.trim() === "") {
      document.getElementById("subject-error").textContent =
        "Subject is required";
      isValid = false;
    }

    // Message validation
    const message = document.getElementById("message");
    if (message.value.trim() === "") {
      document.getElementById("message-error").textContent =
        "Message is required";
      isValid = false;
    }

    // If form is valid, submit it to Supabase
    if (isValid) {
      const formMessage = document.getElementById("form-message");
      formMessage.textContent = "Sending message...";
      formMessage.className = "form-message info";
      
      // Add loading state to button
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
  
      try {
        // Use Supabase REST endpoint with anonymous key
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/contact_messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value,
            created_at: new Date().toISOString(),
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error sending message');
        }
  
        formMessage.textContent = "Thank you for your message! We'll get back to you soon.";
        formMessage.className = "form-message success";
  
        // Reset form
        contactForm.reset();
        
        // Scroll to the message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (error) {
        console.error("Contact form submission error:", error);
        
        // Check if it's a table not found error
        if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
          formMessage.textContent = "Our contact system is currently being set up. Please try again later or contact us directly via email.";
        } else {
          formMessage.textContent = error.message || "Error sending message. Please try again.";
        }
        formMessage.className = "form-message error";
      } finally {
        // Remove loading state from button
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      }
    }
  });
  
  // Add visual feedback on form inputs
  const formInputs = contactForm.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      
      // Show validation on blur
      if (this.id === 'name' && this.value.trim() === '') {
        document.getElementById('name-error').textContent = 'Name is required';
      } else if (this.id === 'email' && !this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
      } else if (this.id === 'subject' && this.value.trim() === '') {
        document.getElementById('subject-error').textContent = 'Subject is required';
      } else if (this.id === 'message' && this.value.trim() === '') {
        document.getElementById('message-error').textContent = 'Message is required';
      }
    });
    
    // Clear error message when typing
    input.addEventListener('input', function() {
      const errorElement = document.getElementById(`${this.id}-error`);
      if (errorElement) {
        errorElement.textContent = '';
      }
    });
  });
  
  // Check if Supabase is properly configured
  if (!supabase || !supabase.supabaseUrl || !supabase.supabaseKey) {
    console.error("Supabase client is not properly configured");
    const formMessage = document.getElementById("form-message");
    formMessage.textContent = "Contact form is currently unavailable. Please email us directly.";
    formMessage.className = "form-message info";
    
    // Disable the form
    Array.from(contactForm.elements).forEach(element => {
      element.disabled = true;
    });
  } else {
    console.log("Supabase client configured successfully");
  }
});
