async function fetchPrediction() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        let optimal = true;
        let predictionText = "";
        let solutionText = "";

        // Nhiệt độ
        const temperature = data.temperature;
        document.getElementById('tempValue').innerText = `${temperature} °C`;
        if (temperature < 20 || temperature > 30) {
            document.getElementById('tempProgress').style.width = "100%";
            document.getElementById('tempFeedback').innerText = "Nhiệt độ không phù hợp!";
            optimal = false;
        } else {
            document.getElementById('tempProgress').style.width = `${(temperature / 30) * 100}%`;
            document.getElementById('tempFeedback').innerText = "Nhiệt độ ổn định.";
        }

        // Độ ẩm
        const humidity = data.humidity;
        document.getElementById('humidityValue').innerText = `${humidity} %`;
        if (humidity < 40 || humidity > 70) {
            document.getElementById('humidityProgress').style.width = "100%";
            document.getElementById('humidityFeedback').innerText = "Độ ẩm không phù hợp!";
            optimal = false;
        } else {
            document.getElementById('humidityProgress').style.width = `${(humidity / 70) * 100}%`;
            document.getElementById('humidityFeedback').innerText = "Độ ẩm ổn định.";
        }

        // Độ ẩm đất
        const soilMoisture = data.soil_moisture;
        document.getElementById('soilMoistureValue').innerText = `${soilMoisture} %`;
        if (soilMoisture < 300 || soilMoisture > 700) {
            document.getElementById('soilMoistureProgress').style.width = "100%";
            document.getElementById('soilMoistureFeedback').innerText = "Độ ẩm đất không phù hợp!";
            optimal = false;
        } else {
            document.getElementById('soilMoistureProgress').style.width = `${(soilMoisture / 700) * 100}%`;
            document.getElementById('soilMoistureFeedback').innerText = "Độ ẩm đất ổn định.";
        }

        // Mức ánh sáng (Đã sửa cho cảm biến ánh sáng ngược)
        const lightLevel = data.light_level;
        document.getElementById('lightValue').innerText = `${lightLevel}`;
        
        // Nếu giá trị cao (tối), thì không phù hợp. Nếu giá trị thấp (sáng), thì ổn định.
        if (lightLevel > 900) {
            document.getElementById('lightProgress').style.width = "100%";
            document.getElementById('lightFeedback').innerText = "Mức ánh sáng không phù hợp!";
            optimal = false;
        } else {
            document.getElementById('lightProgress').style.width = `${(1 - (lightLevel / 1000)) * 100}%`;
            document.getElementById('lightFeedback').innerText = "Ánh sáng ổn định.";
        }

        // Tổng kết kết quả
        if (optimal) {
            predictionText = "Sản lượng cao: Tất cả các thông số đều tối ưu!";
            solutionText = "Giữ nguyên các điều kiện hiện tại.";
        } else {
            predictionText = "Sản lượng thấp: Một hoặc nhiều thông số không phù hợp!";
            solutionText = "Cần điều chỉnh nhiệt độ, độ ẩm, hoặc mức ánh sáng.";
        }

        document.getElementById('predictionResult').innerText = predictionText;
        document.getElementById('solutionResult').innerText = solutionText;
        document.getElementById('timestamp').innerText = new Date().toLocaleString();

    } catch (error) {
        console.error("Lỗi dự đoán:", error);
        document.getElementById('predictionResult').innerText = "Lỗi khi dự đoán!";
        document.getElementById('solutionResult').innerText = "Không thể đưa ra giải pháp.";
    }
}

// Cập nhật dữ liệu mỗi 10 giây
setInterval(fetchPrediction, 10000);
fetchPrediction();
