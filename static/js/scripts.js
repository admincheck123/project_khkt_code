// Function to update the percentage display
function updatePercentDisplay(chartId, percentId, value, max) {
    const percent = ((value / max) * 100).toFixed(1); // Calculate percentage
    document.getElementById(percentId).innerText = percent + '%'; // Update the percent display
}

// Khởi tạo biểu đồ cho từng cảm biến
const temperatureChart = new Chart(document.getElementById('temperatureChart'), {
    type: 'doughnut',
    data: {
        labels: ['Nhiệt độ'],
        datasets: [{
            data: [0, 100],  // Giá trị khởi tạo
            backgroundColor: ['#ff6384', '#e0e0e0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const humidityChart = new Chart(document.getElementById('humidityChart'), {
    type: 'doughnut',
    data: {
        labels: ['Độ ẩm'],
        datasets: [{
            data: [0, 100],  // Giá trị khởi tạo
            backgroundColor: ['#36a2eb', '#e0e0e0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Light Level Chart
const lightChart = new Chart(document.getElementById('lightChart'), {
    type: 'doughnut',
    data: {
        labels: ['Mức ánh sáng'],
        datasets: [{
            data: [0, 1000],  // Giá trị khởi tạo
            backgroundColor: ['#ffcd56', '#e0e0e0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Soil Moisture Chart
const soilMoistureChart = new Chart(document.getElementById('soilMoistureChart'), {
    type: 'doughnut',
    data: {
        labels: ['Độ ẩm đất'],
        datasets: [{
            data: [0, 100],  // Giá trị khởi tạo
            backgroundColor: ['#4bc0c0', '#e0e0e0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// MQ-2 Air Quality Sensor
const mq2Chart = new Chart(document.getElementById('mq2Chart'), {
    type: 'doughnut',
    data: {
        labels: ['MQ-2'],
        datasets: [{
            data: [0, 1000],  // Giá trị khởi tạo cho mức khói
            backgroundColor: ['#ff9f40', '#e0e0e0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Fetch dữ liệu từ API và cập nhật biểu đồ + thông tin hiển thị
async function fetchLatestData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        if (!data.error) {
            // Cập nhật các biểu đồ
            temperatureChart.data.datasets[0].data = [data.temperature, 100 - data.temperature];
            humidityChart.data.datasets[0].data = [data.humidity, 100 - data.humidity];
            lightChart.data.datasets[0].data = [data.light_level, 1000 - data.light_level];
            soilMoistureChart.data.datasets[0].data = [data.soil_moisture, 100 - data.soil_moisture];
            mq2Chart.data.datasets[0].data = [data.mq2_value, 1000 - data.mq2_value];

            // Cập nhật giao diện hiển thị
            document.getElementById('temperature').innerText = data.temperature + '°C';
            document.getElementById('humidity').innerText = data.humidity + '%';
            document.getElementById('mq2').innerText = data.mq2_value;
            document.getElementById('soilMoisture').innerText = data.soil_moisture + '%';
            document.getElementById('light').innerText = data.light_level;
            document.getElementById('timestamp').innerText = data.timestamp;

            // Cập nhật phần trăm hiển thị cho từng biểu đồ
            updatePercentDisplay('temperatureChart', 'temperaturePercent', data.temperature, 100);
            updatePercentDisplay('humidityChart', 'humidityPercent', data.humidity, 100);
            updatePercentDisplay('lightChart', 'lightPercent', data.light_level, 1000);
            updatePercentDisplay('soilMoistureChart', 'soilMoisturePercent', data.soil_moisture, 100);
            updatePercentDisplay('mq2Chart', 'mq2Percent', data.mq2_value, 1000);

            // Cập nhật biểu đồ sau khi có dữ liệu mới
            temperatureChart.update();
            humidityChart.update();
            lightChart.update();
            soilMoistureChart.update();
            mq2Chart.update();
        } else {
            console.error('Lỗi: Không có dữ liệu');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Gọi hàm fetch dữ liệu mỗi 5 giây
setInterval(fetchLatestData, 5000);
fetchLatestData();
