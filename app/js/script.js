const client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');

const topic = 'sensor/toy1';
const topic2 = 'sensor/toy2';

client.on('connect', () => {
    console.log('Connected to broker');
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        }
    });

    client.subscribe(topic2, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic2}`);
        }
    });
});

client.on('message', (topic, message) => {
    const msg = message.toString();
    console.log(`Received message on ${topic}: ${msg}`);

    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `Topic: ${topic}, Message: ${msg}`;
    messagesDiv.appendChild(newMessage);
});