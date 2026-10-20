"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

// Используем CDN-воркер для BareMux, если подключаем его
const connection = new BareMux.BareMuxConnection("https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux/dist/worker.js");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, searchEngine.value);

    let frame = document.getElementById("uv-frame");
    frame.style.display = "block";

    // Настраиваем простой Bare-транспорт через наш рабочий bare-сервер
    try {
        if (await connection.getTransport() !== "https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux/dist/transports/bare.mjs") {
            await connection.setTransport("https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux/dist/transports/bare.mjs", [
                { bare: __uv$config.bare }
            ]);
        }
    } catch (e) {
        console.warn("BareMux transport set failed, fallbacking to default UV config:", e);
    }

    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});
