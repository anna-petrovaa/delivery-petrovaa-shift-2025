import {
  citySelectSend,
  citySelectReceipt,
  approximateSelect,
} from "./js/formFiels.mjs";
import { getPoints } from "./js/getPoints.mjs";
import { getTypes } from "./js/getTypes.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const calculateButton = document.querySelector(".calculate-form-button");

  async function calculate(event) {
    event.preventDefault();

    let validationResult = calculateValidation();

    if (validationResult == false) {
      alert("Заполните все поля формы");
      return;
    }

    try {
      const payload = {};

      const types = JSON.parse(localStorage.getItem("types"));
      //console.log(types);
      const packageInfo = types.find(
        (type) => type.id === approximateSelect.value
      );

      payload.package = {
        length: packageInfo.length,
        width: packageInfo.width,
        weight: packageInfo.weight,
        height: packageInfo.height,
      };

      //console.log("payload", payload);

      const points = JSON.parse(localStorage.getItem("points"));
      //console.log("function calculate", points);
      const citySendInfo = points.find(
        (point) => point.id === citySelectSend.value
      );
      const cityReceiveInfo = points.find(
        (point) => point.id === citySelectReceipt.value
      );

      payload.senderPoint = {
        latitude: citySendInfo.latitude,
        longitude: citySendInfo.longitude,
      };

      payload.receiverPoint = {
        latitude: cityReceiveInfo.latitude,
        longitude: cityReceiveInfo.longitude,
      };

      console.log("payload", payload);
      localStorage.setItem("payload", JSON.stringify(payload));
      //console.log("payloadJSON", JSON.stringify(payload));

      const calculateData = await postDeliveryCalc(payload);
      //console.log(calculateData);
      //console.log("calculateData.options", calculateData.options[0].days);
      localStorage.setItem("calculateData", JSON.stringify(calculateData));
      window.location.href = "delivery.html";
    } catch (err) {
      alert(err);
      alert("Ошибка function calculate");
    }
  }

  getPoints();
  getTypes();

  function calculateValidation() {
    let isValid;
    if (!citySelectSend.value || !approximateSelect.value) {
      //alert("Заполните поля формы");
      isValid = false;
      return isValid;
    }

    if (!citySelectReceipt.value || !approximateSelect.value) {
      //alert("Заполните поля формы");
      isValid = false;
      return isValid;
    }

    if (!approximateSelect.value) {
      //alert("Заполните все поля формы.Выберете размер посылки ");
      isValid = false;
      return isValid;
    }
    isValid = true;
    return isValid;
  }

  //POST запрос!!
  async function postDeliveryCalc(data) {
    try {
      const response = await fetch(
        "https://shift-intensive.ru/api/delivery/calc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Указываем, что отправляем JSON
          },
          body: JSON.stringify(data), // Преобразуем данные в JSON
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Преобразуем ответ в JSON
      //console.log("postDeliveryCalc", result);
      return result;
    } catch (err) {
      alert(err);
    }
  }

  calculateButton.addEventListener("click", calculate);
});
