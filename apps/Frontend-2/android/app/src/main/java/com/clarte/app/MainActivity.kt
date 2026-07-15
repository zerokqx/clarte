package com.clarte.app

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

// Это наш главный экран приложения на телефоне
class MainActivity : AppCompatActivity() {

    // Объявляем переменную для WebView (это специальный элемент, который умеет показывать веб-сайты)
    // lateinit означает, что мы создадим ее чуть позже в коде (в методе onCreate)
    private lateinit var myWebView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Создаем WebView прямо через код на Котлине (так проще, чем писать XML разметку)
        myWebView = WebView(this)

        // Получаем настройки нашего WebView, чтобы включить нужные функции
        val webSettings: WebSettings = myWebView.settings

        // ОБЯЗАТЕЛЬНО: Включаем поддержку JavaScript.
        // Наш фронтенд написан на React, а он не работает без JavaScript!
        webSettings.javaScriptEnabled = true

        // Включаем поддержку локального хранилища (DOM Storage/localStorage).
        // Это нужно, чтобы сохранять сессии, логин, токен авторизации и кэш задач на самом телефоне
        webSettings.domStorageEnabled = true

        // Включаем поддержку WebChromeClient для обработки всплывающих окон, alert() диалогов и выбора файлов (<input type="file">)
        myWebView.webChromeClient = WebChromeClient()

        // Настраиваем поведение при переходе по ссылкам.
        // Без этого WebView при клике на любую ссылку открывал бы стандартный браузер телефона (например, Chrome).
        // Мы переопределяем это, чтобы всё открывалось прямо внутри нашего приложения.
        myWebView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url != null) {
                    view?.loadUrl(url)
                }
                return true // Говорим системе, что мы сами обработали ссылку
            }
        }

        // Загружаем наш сайт/фронтенд.
        // Для локального теста на эмуляторе Android: 10.0.2.2 — это специальный IP,
        // который указывает на компьютер, на котором запущен эмулятор (наш порт 4200).
        // На реальном телефоне тут должен быть адрес нашего бэка/сервера в интернете.
        myWebView.loadUrl("http://10.0.2.2:4200")

        // Устанавливаем наш WebView как единственное содержимое экрана приложения
        setContentView(myWebView)
    }

    // Этот метод обрабатывает нажатие кнопки "Назад" на телефоне.
    // Если мы переходили по страницам внутри нашего веб-приложения (например, из списка задач зашли в настройки),
    // то при нажатии "Назад" мы вернемся на предыдущую веб-страницу, а не закроем приложение сразу.
    override fun onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack() // Возвращаемся на прошлую страницу в WebView
        } else {
            super.onBackPressed() // Если возвращаться некуда, закрываем приложение
        }
    }
}
