<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!--=============== FAVICON ===============-->
    <link rel="shortcut icon" href="{{ asset('assets/img/favicon.png') }}" type="image/x-icon">

    <!--=============== BOXICONS ===============-->
    <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css">

    <!--=============== SWIPER CSS ===============--> 
    <link rel="stylesheet" href="{{ asset('assets/css/swiper-bundle.min.css') }}">

    <!--=============== CSS ===============-->
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/card.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/santa.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/time.css') }}">

</head>
<body>
    
    <!--==================== HEADER ====================-->
    <header class="header" id="header">
        <nav class="nav container">
            <a class="nav__logo">
                <img src="{{ asset('assets/img/logo.png') }}" alt="" class="nav__logo-img"> 
                Clausify
            </a>

            <div class="nav__menu" id="nav-menu">
                <ul class="nav__list">
                    <li class="nav__item">
                        <a href="#home" class="nav__link active-link">Home</a>
                    </li>
                    <li class="nav__item">
                        <a href="#card" class="nav__link">Card</a>
                    </li>
                    {{-- <li class="nav__item">
                        <a href="#message" class="nav__link">Form</a>
                    </li> --}}
                    
                </ul>

                <div class="nav__close" id="nav-close">
                    <i class='bx bx-x' ></i>
                </div>

                <img src="{{ asset('assets/img/nav-light.png') }}" alt="" class="nav__img">
            </div>
            <div class="nav__btns">
                <!-- Theme change button -->
                <i class='bx bx-moon change-theme' id="theme-button"></i>

                <!-- Toggle button -->
                <div class="nav__toggle" id="nav-toggle">
                    <i class='bx bx-grid-alt' ></i>
                </div>
            </div>

        </nav>
    </header>
    
    


    <!--==================== MAIN ====================-->
    <main class="main">
        <!--==================== HOME ====================-->
        <section class="home" id="home" style="padding: 100px 0px; ">
            <div class="home__container container grid">
                
                  
                <img src="{{ asset('assets/img/about-christmas.png') }}" alt="" class="home__img">

                <div class="home__data">
                    <h1 class="home__title">Ho Ho Ho!</h1>
                    <p class="home__description">
                        Santa is waiting for your letter... Make sure you send it before it's too late
                    </p>
                    <a href="#card" class="button">Make a Wish</a>
                </div>
            </div>
            <div class="containertime" style="padding-top: 30px">
                <h1 id="headline">Hurry up, there is not much time left</h1>
                <div id="countdown">
                  <ul class="time">
                    <li><span id="days" class="glow-text"></span>days</li>
                    <li><span id="hours" class="glow-text"></span>Hours</li>
                    <li><span id="minutes" class="glow-text"></span>Minutes</li>
                    <li><span id="seconds" class="glow-text"></span>Seconds</li>
                  </ul>
                </div>
                <div id="content" class="emoji">
                  <span>🥳</span>
                  <span>🎉</span>
                  <span>🎂</span>
                </div>
              </div>
        </section>
        <script>
            (function () {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  //I'm adding this section so I don't have to keep updating this pen every year :-)
  //remove this if you don't need it
  let today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = "12/25/",
      birthday = dayMonth + yyyy;
  
  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  //end
  
  const countDown = new Date(birthday).getTime(),
      x = setInterval(function() {    

        const now = new Date().getTime(),
              distance = countDown - now;

        document.getElementById("days").innerText = Math.floor(distance / (day)),
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

        //do something later when date is reached
        if (distance < 0) {
          document.getElementById("headline").innerText = "It's my birthday!";
          document.getElementById("countdown").style.display = "none";
          document.getElementById("content").style.display = "block";
          clearInterval(x);
        }
        //seconds
      }, 0)
  }());
        </script>


        <div class="background-video" id="card">
            <video autoPlay loop muted class="video-bg">
                <source
                    src="https://cdn.pixabay.com/video/2024/12/09/245751_large.mp4"
                    type="video/mp4"
                />
            </video>
        </div>
        
        <!--==================== CARD SECTION ====================-->
<section class="card-section container section" >
    <div class="card__container js-card-opener">
        <div class="card">
            <div class="card__panel card__panel--front">
                <div class="btn-container">
                    <div class="santa"></div>
                </div>
            </div>
            <div class="card__panel card__panel--inside-left">
                <h1>Merry<br />Christmas<br />2024!</h1>
            </div>
            <div class="card__panel card__panel--inside-right">
                <h1>Send your <br/>letter <br/>to Santa!</h1>
                <label for="upload-pdf" style="padding: 10px 20px; background-color: #226f54; color: #FFF; border-radius: 5px; cursor: pointer; font-size: 24px ;">
                    Upload Letter
                </label>
                <input
                    type="file"
                    id="upload-pdf"
                    style="display: none"
                    onchange="handleUpload(event)" />
            </div>
        </div>
    </div>
</section>  
  
<script>
    async function handleUpload() {
      const fileInput = document.getElementById('upload-pdf');
      const file = fileInput.files[0];
      if (!file) return; // No file selected

      // Prepare FormData
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/input-data', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        // Handle successful response
        alert('File uploaded successfully!');
      } catch (error) {
        // Handle network or server error
        console.error(error);
        alert('Failed to upload file.');
      }
    }
  </script>
        <!--==================== MESSAGE ====================-->
        {{-- <section class="message section container">
            <div class="message__container grid" id="message">
                <form action="" class="message__form">
                    <h2 class="message__title">Send Good <br> Wishes!</h2>
                    <input type="email" placeholder="Write your message" class="message__input">
                    <button class="button message__button">Send Message</button>
                </form>

                <img src="{{ asset('assets/img/message.png') }}" alt="" class="message__img">
            </div>
        </section> --}}
    </main>

    <!--==================== FOOTER ====================-->
    <footer class="footer section">
        <div class="footer__container container grid">
            <div></div>
           
            <div>
                <a href="#" class="footer__logo" style="font-size: 24px; text-align: center;">
                    <img src="{{ asset('assets/img/logo.png') }}" alt="" class="footer__logo-img"> 
                    Clausify
                </a>

                <p class="footer__description" style="font-size: 20px ; text-align: center;">
                    "Everyone deserves <br> to be happy"    
                </p>
            </div>
            

            <div>
                <h3 class="footer__title">Our Services</h3>

                <ul class="footer__links">
                    <li>
                        <a href="#" class="footer__link">Routes</a>
                    </li>
                    <li>
                        <a href="#" class="footer__link">Map</a>
                    </li>
                    <li>
                        <a href="#" class="footer__link">Statistics</a>
                    </li>
                </ul>
            </div>
        </div>

    </footer>

    <!--=============== SWIPER JS ===============-->
    <script src="{{ asset('assets/js/swiper-bundle.min.js') }}"></script>

    <!--=============== MAIN JS ===============-->
    <script src="{{ asset('assets/js/main.js') }}"></script>
    <script>


        document.addEventListener('DOMContentLoaded', function() {
        const openBtn = document.querySelector(".js-card-opener");

        openBtn.onclick = function () {
            document.body.classList.toggle("open");
        };
    });
    </script></body>
</html>
