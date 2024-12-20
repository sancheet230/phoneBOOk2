document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login_register.html'; // Redirect to login if not logged in
    } else {
        displayContacts();
        setupSearchFunctionality();
    }
});

// Display contacts from localStorage
function displayContacts(searchQuery = '') {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.number.includes(searchQuery)
    );

    filteredContacts.forEach((contact) => {
        const contactItem = document.createElement('div');
        contactItem.classList.add('p-4', 'border', 'rounded-lg', 'shadow-sm', 'bg-gray-50');
        contactItem.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${contact.photoURL}" alt="Profile" class="w-16 h-16 rounded-full object-cover">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">${contact.name}</h3>
                    <p class="text-sm text-gray-600">${contact.number}</p>
                    <p class="text-sm text-gray-500">${contact.category}</p>
                </div>
                <div class="ml-auto flex items-center space-x-2">
                    <span class="text-yellow-500">${contact.isFavorite ? '★' : '☆'}</span>
                    <button onclick="showAddContactModal(${contact.id})" class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Edit</button>
                    <button onclick="removeContact(${contact.id})" class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Delete</button>
                </div>
            </div>
        `;
        contactList.appendChild(contactItem);
    });
}

// Search functionality
function setupSearchFunctionality() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', (event) => {
        const searchQuery = event.target.value;
        displayContacts(searchQuery);
    });
}

// Remove contact by ID
function removeContact(contactId) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    displayContacts();
}

// Show "Add/Edit Contact" modal
function showAddContactModal(contactId = null) {
    document.getElementById('addContactForm').reset(); // Reset the form before opening

    if (contactId) {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        const contact = contacts.find(contact => contact.id === contactId);
        if (contact) {
            document.getElementById('contactName').value = contact.name;
            document.getElementById('contactNumber').value = contact.number;
            document.getElementById('contactCategory').value = contact.category;
            document.getElementById('contactFavorite').checked = contact.isFavorite;
            document.getElementById('addContactForm').setAttribute('data-contact-id', contact.id);
        }
    } else {
        document.getElementById('addContactForm').removeAttribute('data-contact-id');
    }

    document.getElementById('addContactModal').classList.remove('hidden');
}

// Close "Add/Edit Contact" modal
function closeAddContactModal() {
    document.getElementById('addContactModal').classList.add('hidden');
}

// Handle adding/editing new contact form submission
document.getElementById('addContactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('contactName').value;
    const number = document.getElementById('contactNumber').value;
    const category = document.getElementById('contactCategory').value;
    const isFavorite = document.getElementById('contactFavorite').checked;
    const photo = document.getElementById('contactPhoto').files[0];

    if (name.trim() === '' || number.trim() === '') {
        alert('Please fill out all fields');
        return;
    }

    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let contactId = new Date().getTime();

    const existingContactId = document.getElementById('addContactForm').getAttribute('data-contact-id');
    if (existingContactId) {
        contactId = parseInt(existingContactId, 10);
        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index > -1) {
            contacts[index] = {
                id: contactId,
                name,
                number,
                category,
                isFavorite,
                photoURL: photo ? URL.createObjectURL(photo) : contacts[index].photoURL
            };
        }
    } else {
        contacts.push({
            id: contactId,
            name,
            number,
            category,
            isFavorite,
            photoURL: photo ? URL.createObjectURL(photo) : 'default-avatar.png'
        });
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
    closeAddContactModal();
});

// Logout user
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login_register.html';
}
