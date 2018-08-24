let cleave = new Cleave('.phone-input', {
    phone: true,
    phoneRegionCode: 'US'
});

let lookUpButton = document.getElementById("look-up");
lookUpButton.onclick = function (event) {
    event.preventDefault();
    let phoneNumber = document.getElementById("phone-number").value.replace(/[^0-9.]/g, "");
    handlePhoneNumberLookup(phoneNumber);
};

function handlePhoneNumberLookup(phoneNumber) {
    fetch("/api/" + phoneNumber)
        .then(response => {
            if (response.ok) {
                return Promise.resolve(response);
            }

            return Promise.reject("Error Fetching Number Information");
        })
        .then(response => response.json())
        .then(data => {
            renderResponse(data);
        })
        .catch(function (error) {
            console.log("Error: " + error)
        })
}

function renderResponse(data) {
    let detailsContainer = document.getElementsByClassName("details")[0];
    detailsContainer.removeAttribute("hidden");
    detailsContainer.innerHTML = '';
    console.log(data);
    if (data.international_format_number && data.national_format_number) {
        detailsContainer.innerHTML += `
                <div class="inner-details">
                <h1>Number Details</h1>
                <table class="output-table">
                    <tr>
                        <td class="side-heading">International Format</td>
                        <td>${data.international_format_number}</td>
                    </tr>
                    <tr>
                        <td class="side-heading">National Format</td>
                        <td>${data.national_format_number}</td>
                    </tr>
                </table>
                </div>`;
    }

    if (data.caller_type && data.country_name) {
        detailsContainer.innerHTML += `
<div class="inner-details">
                <h1>Caller Details</h1>
                <table class="pure-table pure-table-bordered output-table">
                    <tr>
                        <td class="side-heading">Name</td>
                        <td>${data.caller_name || 'Unknown'}</td>
                    </tr>
                    <tr>
                        <td class="side-heading">Type</td>
                        <td>${data.caller_type}</td>
                    </tr>
                    <tr>
                        <td class="side-heading">Country</td>
                        <td>${data.country_name}</td>
                    </tr>
                </table></div>`
    }

    if (data.roaming && data.roaming.roaming_network_name && data.roaming.roaming_country_code) {
        detailsContainer.innerHTML += `
<div class="inner-details">
                <h1>Roaming Details</h1>
                <table class="output-table">
                    <tr>
                        <td class="side-heading">Network Name</td>
                        <td>${data.roaming.roaming_network_name}</td>
                    </tr>
                    <tr>
                        <td class="side-heading">Country Code</td>
                        <td>${data.roaming.roaming_country_code}</td>
                    </tr>
                </table></div>
            `
    }

    if (data.ported && data.original_carrier && data.current_carrier) {
        detailsContainer.innerHTML += `
<div class="inner-details">
    <h1>Porting Information</h1>
                <table class="output-table">
                    <tr>
                        <td class="side-heading">Status
                        </td>
                        <td>${data.ported}</td>
                    </tr>
                </table>
                <h2>Current Carrier</h2>
                <table class="output-table">
                    <tr>
                        <td class="side-heading">Name</td>
                        <td>${data.current_carrier.name}</td>
                    </tr>
                    <tr>
                        <td class="side-heading">Country</td>
                        <td>${data.current_carrier.country}</td>
                    </tr>
                </table>
                <h2>Original Carrier</h2>
                <table class="output-table">
                    <tr>
                        <td class="side-heading">Name</td>
                        <td>${data.original_carrier.name}</td>
                    </tr>
                    <tr>
                        <td class="side-heading">Country</td>
                        <td>${data.original_carrier.country}</td>
                    </tr>
                </table></div>
            `
    }
}