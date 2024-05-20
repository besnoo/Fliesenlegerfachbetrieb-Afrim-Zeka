document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    const formResponse = document.getElementById('formResponse');
    formResponse.textContent = result.message;

    if (response.ok) {
        document.getElementById('contactForm').reset();
    }
});
