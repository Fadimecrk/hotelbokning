// Variabel för valt rum
let selectedRoom = null;

// Vänta tills sidan är laddad
document.addEventListener('DOMContentLoaded', function() {
    // Sätt minsta datum till idag för incheckning
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in').setAttribute('min', today);
    
    // Lägg till klickhändelser för rumkort
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        card.addEventListener('click', function() {
            // Ta bort tidigare val
            roomCards.forEach(c => c.classList.remove('selected'));
            
            // Markera valt rum
            this.classList.add('selected');
            selectedRoom = this.dataset.room;
        });
    });

    // Hantera formulärinlämning
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Kontrollera att ett rum är valt
        if (!selectedRoom) {
            alert('Vänligen välj en rumtyp');
            return;
        }

        // Samla formulärdata
        const formData = {
            room: selectedRoom,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            checkIn: document.getElementById('check-in').value,
            checkOut: document.getElementById('check-out').value,
            guests: document.getElementById('guests').value,
            specialRequests: document.getElementById('special-requests').value,
            bookingDate: new Date().toLocaleString('sv-SE')
        };

        // Visa bekräftelse
        showConfirmation(formData);
    });

    // Uppdatera utcheckningsdatum när incheckning ändras
    document.getElementById('check-in').addEventListener('change', function() {
        const checkIn = new Date(this.value);
        checkIn.setDate(checkIn.getDate() + 1);
        const minCheckOut = checkIn.toISOString().split('T')[0];
        document.getElementById('check-out').setAttribute('min', minCheckOut);
    });
});

// Visa bokningssidan
function showBookingPage() {
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('booking-page').classList.add('active');
    window.scrollTo(0, 0);
}

// Visa startsidan
function showHomePage() {
    document.getElementById('booking-page').classList.remove('active');
    document.getElementById('home-page').classList.add('active');
    window.scrollTo(0, 0);
}

// Visa bekräftelse
function showConfirmation(data) {
    // Dölj formuläret
    document.getElementById('booking-form-section').style.display = 'none';
    
    // Visa bekräftelsen
    const confirmationSection = document.getElementById('confirmation-section');
    confirmationSection.classList.remove('hidden');
    
    // Skapa bokningsdetaljer
    const roomNames = {
        'standard': 'Standard rum',
        'deluxe': 'Deluxe rum',
        'suite': 'Suite'
    };

    const roomPrices = {
        'standard': '1 200 kr',
        'deluxe': '1 800 kr',
        'suite': '3 500 kr'
    };

    const bookingDetails = document.getElementById('booking-details');
    bookingDetails.innerHTML = `
        <p><strong>Namn:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>E-post:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Rumtyp:</strong> ${roomNames[data.room]}</p>
        <p><strong>Pris:</strong> ${roomPrices[data.room]} / natt</p>
        <p><strong>Incheckning:</strong> ${formatDate(data.checkIn)}</p>
        <p><strong>Utcheckning:</strong> ${formatDate(data.checkOut)}</p>
        <p><strong>Antal gäster:</strong> ${data.guests}</p>
        ${data.specialRequests ? `<p><strong>Speciella önskemål:</strong> ${data.specialRequests}</p>` : ''}
        <p><strong>Bokningsnummer:</strong> #${generateBookingNumber()}</p>
    `;

    // Scrolla till toppen
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Återställ bokningen
function resetBooking() {
    // Visa formuläret igen
    document.getElementById('booking-form-section').style.display = 'block';
    
    // Dölj bekräftelsen
    document.getElementById('confirmation-section').classList.add('hidden');
    
    // Återställ formuläret
    document.getElementById('booking-form').reset();
    
    // Ta bort valt rum
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(c => c.classList.remove('selected'));
    selectedRoom = null;
    
    // Scrolla till toppen
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Hjälpfunktion för att formatera datum
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('sv-SE', options);
}

// Generera ett slumpmässigt bokningsnummer
function generateBookingNumber() {
    return 'GH' + Math.floor(100000 + Math.random() * 900000);
}
