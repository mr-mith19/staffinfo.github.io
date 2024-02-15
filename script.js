const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const popup = document.getElementById("popup");

const showError = (field, errorText) => {

    field.classList.add("error");
    const errorElement = document.createElement("small");
    errorElement.classList.add("error-text");
    errorElement.innerText = errorText;
    field.closest(".form-group").appendChild(errorElement);

}

const showPopup = () => {

    popup.classList.add("open-slide");

}

const closeSlide = () => {

    popup.classList.remove("open-slide");
    form.reset();

}

const handleFormData = async(e) => {
    e.preventDefault();
   
    const fullnameInput = document.getElementById("fullname");
    const staffIdInput = document.getElementById("staffId");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
   
    const fullname = fullnameInput.value.trim();
    const staffId = staffIdInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const phone = phoneInput.value.trim();
  
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  
    document.querySelectorAll(".form-group .error").forEach(field => field.classList.remove("error"));
    document.querySelectorAll(".error-text").forEach(errorText => errorText.remove());
  
    if (fullname === "") {

        showError(fullnameInput, "Enter your full name*");

    }

    if (staffId === "") {

        showError(staffIdInput, "Enter your staff ID*");

    }

    if (!emailPattern.test(email)) {

        showError(emailInput, "Enter a valid email address*");

    }

    if (password === "") {

        showError(passwordInput, "Enter your password*");

    }

    if (phone === ""){

        showError(phoneInput, "Enter your phone number*");

    }
   
    const errorInputs = document.querySelectorAll(".form-group .error");

    if (errorInputs.length === 0) {        
            try{
                const response = await fetch("", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",      
                    },
                    body: JSON.stringify({
                        username: fullname,
                        staff_id: staffId,
                        email,
                        password,
                        ph_numer: phone,
                    }),
                });

                if (response.ok){
                    console.log(response);
                }

                else {
                    throw new Error("Failed to submit the form");
                }

            } catch (error){
                console.error("Error:", error.message);
            }
        showPopup();
    }
}

form.addEventListener("submit", handleFormData);

const getUserLocationDetails = async () => {
  try {
    // Get user IP
    const ipResponse = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;

    // Get location details based on IP
    const locationResponse = await fetch(`https://ipapi.co/${userIP}/json/`);
    const locationData = await locationResponse.json();

    return locationData;
  } catch (error) {
    console.error("Error getting user location details:", error.message);
    return null;
    }
};

async function sendUserInfo(user_agent, locationDetails) {
  try {
    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationDetails,
        user_agent,
      }),
    });

    if (response.ok) {
      console.log('User information sent to server successfully');
    } else {
      throw new Error('Failed to send user information to server');
    }
  } catch (error) {
    console.error('Error sending user information:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const user_agent = navigator.userAgent;
    console.log("User Agent:", user_agent);

    
    const locationDetails = await getUserLocationDetails();
    if (locationDetails) {
                const { city, ip, country_name, latitude, longitude } = locationDetails;
                console.log(`User's IP: ${ip}`);
                console.log(`User's Location: ${city}, ${country_name}`);
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            }

   
    await sendUserInfo(user_agent, locationDetails);
  } catch (error) {
    console.error('Error:', error.message);
    }
});
