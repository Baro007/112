```javascript
// Güvenli Giriş Kontrolü
document.getElementById('passcodeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var passcode = document.getElementById('passcodeInput').value;
    if (passcode === 'proje112') {
        document.getElementById('passcodeContainer').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        if (window.map) {
            window.map.invalidateSize();
        }
    } else {
        alert('Yanlış passcode. Lütfen tekrar deneyin.');
    }
});

// Arka Plan Animasyonları (Matrix ve Parçacıklar)
// Matrix Arka Plan
var matrixCanvas = document.getElementById("matrix-bg");
var matrixCtx = matrixCanvas.getContext("2d");

matrixCanvas.height = window.innerHeight;
matrixCanvas.width = window.innerWidth;

var matrix = "10ABCDEF";
matrix = matrix.split("");

var font_size = 10;
var columns = matrixCanvas.width / font_size;
var drops = [];
for (var x = 0; x < columns; x++)
    drops[x] = 1;

function drawMatrix() {
    matrixCtx.fillStyle = "rgba(0, 10, 30, 0.04)";
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixCtx.fillStyle = "#00FFFF";
    matrixCtx.font = font_size + "px arial";
    for (var i = 0; i < drops.length; i++) {
        var text = matrix[Math.floor(Math.random() * matrix.length)];
        matrixCtx.fillText(text, i * font_size, drops[i] * font_size);

        if (drops[i] * font_size > matrixCanvas.height && Math.random() > 0.975)
            drops[i] = 0;

        drops[i]++;
    }
}

// Parçacık Sistemi
const particleCanvas = document.getElementById('particle-canvas');
const particleCtx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (particleCanvas.height / 80) * (particleCanvas.width / 80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        particleCtx.fillStyle = '#00FFFF';
        particleCtx.fill();
    }
    update() {
        if (this.x > particleCanvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > particleCanvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < particleCanvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < particleCanvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (particleCanvas.height * particleCanvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#00FFFF';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    particleCtx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (particleCanvas.width / 7) * (particleCanvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                particleCtx.strokeStyle = 'rgba(0, 255, 255,' + opacityValue + ')';
                particleCtx.lineWidth = 1;
                particleCtx.beginPath();
                particleCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
                particleCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
                particleCtx.stroke();
            }
        }
    }
}

window.addEventListener('resize',
    function() {
        matrixCanvas.width = particleCanvas.width = innerWidth;
        matrixCanvas.height = particleCanvas.height = innerHeight;
        mouse.radius = ((particleCanvas.height / 80) * (particleCanvas.height / 80));
        initParticles();
    }
);

window.addEventListener('mouseout',
    function() {
        mouse.x = undefined;
        mouse.x = undefined;
    }
)

initParticles();
animateParticles();
setInterval(drawMatrix, 35);

// Optimizasyon Demo Kodu
document.addEventListener('DOMContentLoaded', function() {
    const istanbul = [41.0082, 28.9784];
    window.map = L.map('opt_map-container').setView(istanbul, 10);

    // Harita Katmanı
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.map);

    let stations = [];
    let cases = [];
    let ambulances = [];
    const stationMarkers = L.layerGroup().addTo(window.map);
    const caseMarkers = L.layerGroup().addTo(window.map);

    // İstasyonları Başlatma
    function initializeStations() {
        stations = [];
        for (let i = 0; i < 300; i++) {
            stations.push({
                id: i,
                lat: istanbul[0] + (Math.random() - 0.5) * 0.5,
                lng: istanbul[1] + (Math.random() - 0.5) * 0.5,
                baseCases: Math.floor(Math.random() * 50) + 1,
                staff: Math.floor(Math.random() * 3) + 3,
                ambulances: Math.floor(Math.random() * 2) + 1,
                active: true,
                efficiency: Math.random() * 0.5 + 0.5
            });
        }
    }

    // Vaka Noktalarını Başlatma
    function initializeCases() {
        cases = [];
        for (let i = 0; i < 50; i++) {
            cases.push({
                id: i,
                lat: istanbul[0] + (Math.random() - 0.5) * 0.5,
                lng: istanbul[1] + (Math.random() - 0.5) * 0.5,
                active: true
            });
        }
    }

    // İstasyonları Haritaya Ekleme
    function addStationsToMap() {
        stationMarkers.clearLayers();
        stations.forEach((station) => {
            if (station.active) {
                const marker = L.circleMarker([station.lat, station.lng], {
                    radius: 5,
                    fillColor: getColor(station.cases),
                    color: '#fff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                    className: station.active ? 'station-marker active' : 'station-marker inactive'
                }).addTo(stationMarkers);

                marker.bindPopup(createPopupContent(station), {
                    className: 'custom-popup'
                });

                marker.on('mouseover', function(e) {
                    this.openPopup();
                });

                marker.on('click', function() {
                    showStationDetails(station);
                });
            }
        });
    }

    // Vaka Noktalarını Haritaya Ekleme
    function addCasesToMap() {
        caseMarkers.clearLayers();
        cases.forEach((c) => {
            if (c.active) {
                const marker = L.circleMarker([c.lat, c.lng], {
                    radius: 5,
                    fillColor: '#FF0000',
                    color: '#FFFFFF',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(caseMarkers);
                marker.bindPopup(`Vaka ID: ${c.id}`);
            }
        });
    }

    // Pop-up İçeriği Oluşturma
    function createPopupContent(station) {
        return `
            <div class="station-info">
                <h3>İstasyon #${station.id}</h3>
                <div class="station-metric">
                    <span>Vaka Sayısı:</span>
                    <span>${station.cases}</span>
                </div>
                <div class="station-metric">
                    <span>Personel:</span>
                    <span>${station.staff}</span>
                </div>
                <div class="station-metric">
                    <span>Ambulans:</span>
                    <span>${station.ambulances}</span>
                </div>
                <div class="station-metric">
                    <span>Verimlilik:</span>
                    <span>${(station.efficiency * 100).toFixed(1)}%</span>
                </div>
            </div>
        `;
    }

    const timeSlider = document.getElementById('opt_time-slider');
    const currentTime = document.getElementById('opt_current-time');
    const scenarioSelect = document.getElementById('scenario-select');

    timeSlider.addEventListener('input', (e) => {
        const hour = parseInt(e.target.value);
        currentTime.textContent = `${hour.toString().padStart(2, '0')}:00`;
        updateStations(hour);
    });

    scenarioSelect.addEventListener('change', () => {
        updateStations(parseInt(timeSlider.value));
    });

    // İstasyonları Güncelleme
    function updateStations(hour) {
        const scenario = scenarioSelect.value;
        const hourlyDistributions = {
            normal: [0.2, 0.1, 0.1, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0, 1.0, 0.9, 0.8, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.3],
            busy: [0.3, 0.2, 0.2, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0, 1.1, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.7, 0.5, 0.4],
            holiday: [0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2]
        };

        const distribution = hourlyDistributions[scenario];

        stations.forEach((station) => {
            if (station.active) {
                station.cases = Math.floor(station.baseCases * distribution[hour]);
                if (station.cases < 1) station.cases = 1;
            }
        });
        addStationsToMap();
        updateDataPanel();
        updateRealTimeStats();
    }

    function getColor(cases) {
        if (cases > 40) return '#ff0000';
        if (cases > 30) return '#ff7f00';
        if (cases > 20) return '#ffff00';
        return '#00ff00';
    }

    function updateDataPanel() {
        const totalCases = stations.reduce((sum, station) => sum + (station.active ? station.cases : 0), 0);
        const activeStations = stations.filter(station => station.active).length;
        const efficiency = Math.floor((activeStations / 300) * 100);

        document.getElementById('opt_active-cases').textContent = totalCases;
        document.getElementById('opt_total-stations').textContent = activeStations;
        document.getElementById('opt_system-efficiency').textContent = `%${efficiency}`;

        const staffStatus = stations.some(station => station.staff < 3 && station.active) ? 'Eksik' : 'Tam';
        document.getElementById('opt_staff-status').textContent = staffStatus;
        document.getElementById('opt_staff-status').style.color = staffStatus === 'Tam' ? '#00bcd4' : '#FF5252';
    }

    // Ambulansları Başlatma
    function initializeAmbulances() {
        ambulances = [];
        stations.forEach((station) => {
            if (station.active) {
                for (let i = 0; i < station.ambulances; i++) {
                    let ambulanceMarker = L.circleMarker([station.lat, station.lng], {
                        radius: 6,
                        color: '#FFFFFF',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1,
                        className: 'ambulance-marker'
                    }).addTo(window.map);
                    ambulanceMarker.stationLocation = L.latLng(station.lat, station.lng);

                    // Rastgele bir vaka seç ve hareketi başlat
                    let randomCase = cases[Math.floor(Math.random() * cases.length)];
                    moveAmbulanceToCase(ambulanceMarker, randomCase);

                    ambulances.push(ambulanceMarker);
                }
            }
        });
    }

    // Ambulansı Vaka Noktasına Hareket Ettirme
    function moveAmbulanceToCase(ambulance, caseLocation) {
        let startPoint = ambulance.getLatLng();
        let endPoint = L.latLng(caseLocation.lat, caseLocation.lng);

        L.Routing.control({
            waypoints: [startPoint, endPoint],
            createMarker: function() { return null; },
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            show: false
        }).on('routesfound', function(e) {
            let route = e.routes[0].coordinates;
            animateAmbulance(ambulance, route, function() {
                // Vaka noktasında 3 saniye bekle
                setTimeout(function() {
                    // İstasyona geri dön
                    moveAmbulanceToStation(ambulance);
                }, 3000);
            });
        }).addTo(window.map);
    }

    // Ambulans Animasyonu
    function animateAmbulance(ambulance, route, callback) {
        let index = 0;
        function move() {
            ambulance.setLatLng([route[index].lat, route[index].lng]);
            index++;
            if (index < route.length) {
                setTimeout(move, 50); // Hızı ayarlayabilirsiniz
            } else {
                if (callback) callback();
            }
        }
        move();
    }

    // Ambulansı İstasyona Geri Döndürme
    function moveAmbulanceToStation(ambulance) {
        let endPoint = ambulance.stationLocation;
        let startPoint = ambulance.getLatLng();

        L.Routing.control({
            waypoints: [startPoint, endPoint],
            createMarker: function() { return null; },
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            show: false
        }).on('routesfound', function(e) {
            let route = e.routes[0].coordinates;
            animateAmbulance(ambulance, route, function() {
                // Döngüsel hareket için tekrar vaka seç
                let randomCase = cases[Math.floor(Math.random() * cases.length)];
                moveAmbulanceToCase(ambulance, randomCase);
            });
        }).addTo(window.map);
    }

    // Gerçek Zamanlı İstatistikleri Güncelleme
    const casesData = Array(24).fill(0);
    const efficiencyData = Array(24).fill(0);

    const casesChart = new Chart(document.getElementById('casesChart'), {
        type: 'line',
        data: {
            labels: Array(24).fill(''),
            datasets: [{
                label: 'Günlük Vaka Sayısı',
                data: casesData,
                borderColor: '#00FFFF',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const efficiencyChart = new Chart(document.getElementById('efficiencyChart'), {
        type: 'line',
        data: {
            labels: Array(24).fill(''),
            datasets: [{
                label: 'Sistem Verimliliği',
                data: efficiencyData,
                borderColor: '#00FF00',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    function calculateSystemEfficiency() {
        const totalStations = 300;
        const activeStations = stations.filter(s => s.active).length;
        const avgResponseTimeText = document.getElementById('avg-response-time').textContent;
        const averageResponseTime = parseFloat(avgResponseTimeText.replace(' dk', '')) || 0;
        const activeAmbulances = ambulances.length;

        // Basit bir verimlilik hesaplaması
        let efficiency = (activeStations / totalStations) * 100;
        efficiency -= averageResponseTime; // Yanıt süresi verimliliği düşürür
        efficiency += activeAmbulances * 0.5; // Aktif ambulans sayısı verimliliği artırır

        return efficiency.toFixed(2);
    }

    function updateRealTimeStats() {
        const avgResponseTime = Math.floor(Math.random() * 10) + 5;
        const activeAmbulances = ambulances.length;
        const dailyCases = stations.reduce((sum, station) => sum + station.cases, 0);

        document.getElementById('avg-response-time').textContent = `${avgResponseTime} dk`;
        document.getElementById('active-ambulances').textContent = activeAmbulances;
        document.getElementById('daily-cases').textContent = dailyCases;

        // Mini grafik güncelleme
        casesData.shift();
        casesData.push(dailyCases);
        casesChart.data.datasets[0].data = casesData;
        casesChart.update();

        // Verimlilik grafiğini güncelle
        const efficiency = calculateSystemEfficiency();
        efficiencyData.shift();
        efficiencyData.push(efficiency);
        efficiencyChart.data.datasets[0].data = efficiencyData;
        efficiencyChart.update();
    }

    function showStationDetails(station) {
        const detailsElement = document.getElementById('station-details');
        detailsElement.style.display = 'block';
        document.getElementById('station-id').textContent = station.id;
        document.getElementById('station-staff').textContent = station.staff;
        document.getElementById('station-ambulances').textContent = station.ambulances;
        document.getElementById('station-cases').textContent = station.cases;
        document.getElementById('station-efficiency').textContent = `${(station.efficiency * 100).toFixed(1)}%`;
    }

    let optimizationInProgress = false;
    let previousEfficiency = calculateSystemEfficiency();

    document.getElementById('opt_start-optimization').addEventListener('click', startOptimization);

    document.getElementById('opt_reset-simulation').addEventListener('click', () => {
        initializeStations();
        initializeCases();
        addCasesToMap();
        initializeAmbulances();
        updateStations(parseInt(timeSlider.value));
        const feedbackElement = document.getElementById('opt_feedback');
        feedbackElement.innerHTML = '';
        feedbackElement.style.display = 'none';
        optimizationInProgress = false;
        previousEfficiency = calculateSystemEfficiency();
    });

    function startOptimization() {
        if (optimizationInProgress) return;
        optimizationInProgress = true;

        const feedbackElement = document.getElementById('opt_feedback');
        feedbackElement.style.display = 'block';
        feedbackElement.innerHTML = `
            <div class="optimization-info">
                <p>Optimizasyon başlatılıyor...</p>
                <div class="optimization-progress">
                    <div class="optimization-bar"></div>
                </div>
            </div>
        `;

        const progressBar = feedbackElement.querySelector('.optimization-bar');
        gsap.to(progressBar, { width: '100%', duration: 3, ease: 'power1.inOut' });

        setTimeout(() => {
            // Optimizasyon işlemi
            previousEfficiency = calculateSystemEfficiency();

            const lowPerformanceStations = stations.filter(station =>
                station.efficiency < 0.7 && station.active
            ).sort((a, b) => a.efficiency - b.efficiency);

            const stationsToClose = lowPerformanceStations.slice(0, 30);
            stationsToClose.forEach(station => {
                station.active = false;
            });

            addStationsToMap();
            updateDataPanel();

            const closedCount = stationsToClose.length;
            const newEfficiency = calculateSystemEfficiency();

            feedbackElement.innerHTML = `
                <div class="optimization-info">
                    <p>Optimizasyon tamamlandı.</p>
                    <p>${closedCount} düşük performanslı istasyon kapatıldı.</p>
                    <p>Sistem verimliliği %${previousEfficiency} den %${newEfficiency} e yükseldi.</p>
                </div>
            `;

            gsap.from(feedbackElement, { opacity: 0, y: 20, duration: 1 });
            optimizationInProgress = false;

            // Verimlilik grafiğini güncelle
            efficiencyData.shift();
            efficiencyData.push(newEfficiency);
            efficiencyChart.data.datasets[0].data = efficiencyData;
            efficiencyChart.update();
        }, 3000);
    }

    function updateSimulation() {
        updateStations(parseInt(timeSlider.value));
        updateRealTimeStats();
    }

    setInterval(updateSimulation, 5000); // Her 5 saniyede bir güncelle

    // Başlatma Fonksiyonları
    initializeStations();
    initializeCases();
    addCasesToMap();
    initializeAmbulances();
    addStationsToMap();
    updateStations(12); // Başlangıç saati
});
```
