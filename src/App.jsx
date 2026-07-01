import { useEffect, useRef, useState } from 'react'
import './App.css'
import Recuerdos from './Recuerdos.jsx'
import Misal from './Misal.jsx'
function GatiGame() {
  const [jumping, setJumping] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const wrapRef = useRef(null)

  const jump = () => {
    if (gameOver) {
      setGameOver(false)
      setScore(0)
      return
    }

    if (jumping) return

    setJumping(true)
    setScore((prev) => prev + 1)

    setTimeout(() => {
      setJumping(false)
    }, 720)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jumping, gameOver])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const handleTouch = (e) => {
      e.preventDefault() // respuesta instantánea + evita zoom/click duplicado en iPhone
      jump()
    }

    el.addEventListener('touchstart', handleTouch, { passive: false })
    return () => el.removeEventListener('touchstart', handleTouch)
  }, [jumping, gameOver])

  useEffect(() => {
    if (gameOver) return

    const collisionTimer = setInterval(() => {
      const gati = document.querySelector('.gatiBox')
      const obstacle = document.querySelector('.obstacle')

      if (!gati || !obstacle) return

      const gatiRect = gati.getBoundingClientRect()
      const obstacleRect = obstacle.getBoundingClientRect()

      const collision =
        gatiRect.right > obstacleRect.left + 10 &&
        gatiRect.left < obstacleRect.right - 10 &&
        gatiRect.bottom > obstacleRect.top + 10

      if (collision) {
        setGameOver(true)

        setTimeout(() => {
          setGameOver(false)
          setScore(0)
        }, 1300)
      }
    }, 40)

    return () => clearInterval(collisionTimer)
  }, [gameOver])

  return (
    <div ref={wrapRef} className={`gameWrap ${gameOver ? 'paused' : ''}`} onClick={jump}>
      <div className="score">Score: {score}</div>

      {gameOver && (
        <div className="gameOver">
          <h3>Game Over 🐟</h3>
          <p>Tap or press space to restart</p>
        </div>
      )}

      <div className={`gatiBox ${jumping ? 'jump' : ''}`}>
        <img src={gameOver ? '/gati-sad.png' : '/gati.png'} alt="Gati" />
      </div>

      <div className="obstacle"></div>

      <div className="panamaSkyline">
        {[1, 2, 3].map((set) => (
          <div className="skylineSet" key={set}>
            <div className="building ocean"></div>
            <div className="building towerOne"></div>
            <div className="building skinny"></div>
            <div className="building screw"></div>
            <div className="building sail"></div>
            <div className="building curve"></div>
            <div className="building towerTwo"></div>
            <div className="building short"></div>
            <div className="building needle"></div>
            <div className="building towerOne"></div>
            <div className="building screw"></div>
            <div className="building sail"></div>
            <div className="building curve"></div>
            <div className="building skinny"></div>
          </div>
        ))}
      </div>
    </div>
  )
}


function CollapseSection({ id, className, label, title, children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#' + id) setOpen(true)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [id])

  return (
    <section id={id} className={`${className} collapsible ${open ? 'isOpen' : ''}`}>
      <button
        type="button"
        className="collapseHeader"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="collapseHeadText">
          {label ? <span className="sectionLabel">{label}</span> : null}
          <span className="collapseTitle">{title}</span>
        </span>
        <span className="collapseIcon" aria-hidden="true">{open ? '\u2013' : '+'}</span>
      </button>
      <div className="collapseBody">{children}</div>
    </section>
  )
}

function App() {
function App() {
  const route = window.location.hash.replace('#', '') || '/'

  if (route === '/recuerdos') {
    return <Recuerdos />
  }

  if (route === '/misal') {
    return <Misal />
  }

  const [entered, setEntered] = useState(false)
  const [opened, setOpened] = useState(false)
  

  return (
    <>
      {!entered && (
        <div className="inviteOverlay">
          {!opened ? (
            <button
              type="button"
              className="inviteCover"
              onClick={() => setOpened(true)}
              aria-label="Abrir invitación"
            >
              <span className="coverLabel">Rafael &amp; Jimena</span>
              <span className="coverEnvelope">
                <span className="coverSeal">R&amp;J</span>
              </span>
              <span className="coverHint">Toca para abrir</span>
            </button>
          ) : (
            <div className="inviteEnvelope">
              <div className="invitationPaper">
                <p className="inviteSmall">
                  Con amor inmenso, los invitamos a ser parte de nuestra
                  felicidad. Acompáñanos a nuestra ceremonia en presencia de
                  Dios.
                </p>

                <img
                  className="inviteImage"
                  src="/invitacion.jpg"
                  alt="Invitación de boda de Rafael y Jimena"
                />

                <button onClick={() => setEntered(true)}>Enter</button>
              </div>
              <div className="inviteEnvelopeFront"></div>
            </div>
          )}
        </div>
      )}

      <div className="pageWrapper">
  <main>
      <a
  href="https://forms.gle/Sjww1UcEo9ob4oCY7"
  target="_blank"
  rel="noreferrer"
  className="rsvpButton"
>
  RSVP
</a>

<a
  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Rafael+%26+Jimena&dates=20260711T190000/20260712T040000&location=Santuario+Nacional+de+Panama&details=Wedding+Ceremony+of+Rafael+%26+Jimena"
  target="_blank"
  rel="noreferrer"
  className="calendarButton"
>
  Add to Calendar
</a>
      <section className="hero">
        <div className="initial initialLeft">R</div>
        <div className="initial initialRight">J</div>

        <div className="saveCard">
          <p className="topText">Faith. Hope. Love. Above all, love.</p>

          <div className="line"></div>

          <p className="smallCaps">For the wedding of</p>
          <h1>Rafael</h1>
          <p className="amp">&</p>
          <h1>Jimena</h1>
          <p className="date">Jul 11, 2026</p>

          <div className="line"></div>

          <p className="intro">
            A guide for our favorite people.
          </p>

          <div className="heroButtons">
            <a href="#events">View Events</a>
            <a href="#guide">Guest Guide</a>
            <div className="galleryCTA">
  <a href="#/recuerdos" className="galleryButton">
    Nuestra Galería 
  </a>
</div>
          </div>
        </div>
      </section>

      <CollapseSection id="events" className="section" label="The Celebration" title="Wedding Weekend">

        <div className="grid">
          <a className="boxButton featured" href="#wedding">
            <span>July 11</span>
            <h3>Wedding Day</h3>
            <p>Ceremony & Reception · Panama City</p>
          </a>
        </div>
      </CollapseSection>

      <CollapseSection id="guide" className="section alt" label="Traveling from abroad?" title="International Guest Guide">

        <div className="guideGrid">
          <a className="boxButton" href="#stay">
            <h3>Where to Stay</h3>
            <p>Hotels in Casco Viejo, Punta Pacífica, Obarrio and Costa del Este.</p>
          </a>

          <a className="boxButton" href="#eat">
  <h3>Eat</h3>
  <p>Fine dining, casual spots, brunch and local favorites.</p>
</a>

<a className="boxButton" href="#drinks">
  <h3>Drinks</h3>
  <p>Rooftops, cocktail bars and places for a night out.</p>
</a>

          <a className="boxButton" href="#explore">
            <h3>Explore Panama</h3>
            <p>Canal, Casco Viejo, Amador, Taboga, San Blas and more.</p>
          </a>

          <a className="boxButton" href="#tips">
            <h3>Travel Tips</h3>
            <p>Weather, Uber, currency, packing notes and useful contacts.</p>
          </a>
          <a className="boxButton" href="#game">
  <h3>Gati Game</h3>
  <p>A tiny Panama skyline game starring our owner.</p>
</a>
        </div>
        
      </CollapseSection>

      <section id="wedding" className="detailSection">
        <p className="sectionLabel">July 11</p>
        <h2>Wedding Day Details</h2>

        <div className="detailGrid">
<div className="detailCard">
  <h3>Ceremony</h3>
  <p><strong>Time:</strong> 7:00 PM</p>
  <p>Santuario Nacional de Panamá</p>

  <div className="mapEmbed">
    <iframe
      src="https://www.google.com/maps?q=Santuario+Nacional+de+Panama&output=embed"
      loading="lazy"
    ></iframe>
  </div>

  <a href="https://maps.app.goo.gl/PGiRdjwXgWZWtW1r6" target="_blank">
    Open in Maps
  </a>
</div>

          <div className="detailCard">
  <h3>Reception</h3>
  <p><strong>Time:</strong> 8:30 PM</p>
  <p>Club Unión · Salón Las Perlas</p>

  <div className="mapEmbed">
    <iframe
      src="https://www.google.com/maps?q=Club+Union+Panama&output=embed"
      loading="lazy"
    ></iframe>
  </div>

  <a href="https://maps.app.goo.gl/3wp2zkvhHMqMfQiz9" target="_blank">
    Open in Maps
  </a>
</div>

          <div className="detailCard">
            <h3>Dress Code</h3>
            <p>Formal attire</p>
          </div>

          <div className="detailCard giftsCard">
            <h3>Gifts</h3>
            <p className="giftsLead">
              Tu presencia es nuestro mayor regalo. Si deseas tener un detalle
              con nosotros, lo agradecemos de todo corazón.
            </p>

            <div className="giftsOptions">
              <a
                className="giftBtn"
                href="https://www.amazon.com/wedding/share/YEENAVARRO"
                target="_blank"
                rel="noopener noreferrer"
              >
                Amazon Registry
              </a>

              <div className="giftYappy">
                <span className="giftYappyLabel">Yappy</span>
                <span className="giftYappyNum">(+507) 6550-5354</span>
              </div>

              <div className="giftYappy">
                <span className="giftYappyLabel">Banco General · Ahorros</span>
                <span className="giftYappyNum">04-05-99-037494-3</span>
                <span className="giftYappyName">Jimena Navarro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="game" className="detailSection alt">
  <p className="sectionLabel">Gati and the Tuna Game</p>
  <h2>Let's Play</h2>
  <p className="sectionIntro">
    Press space or tap the game to jump over the Panama skyline, do not eat the tuna!
  </p>

  <GatiGame />
</section>

<CollapseSection id="stay" className="detailSection alt" label="International Guide" title="Where to Stay">

  <div className="detailGrid">

    <div className="detailCard">
      <h3>JW Marriott (Punta Pacífica)</h3>
      <p>Luxury · Ocean views · Iconic tower</p>
      <p><strong>Approx:</strong> $250 – $450 / night</p>

      <div className="mapEmbed">
        <iframe src="https://www.google.com/maps?q=JW+Marriott+Panama&output=embed"></iframe>
      </div>

      <a href="https://maps.app.goo.gl/9gY8q8qM9Jz7cQe59" target="_blank">
        Open in Maps
      </a>
    </div>

    <div className="detailCard">
      <h3>Residence Inn by Marriott (Pacific Center)</h3>
      <p>Modern · Walkable · Great location</p>
      <p><strong>Approx:</strong> $140 – $260 / night</p>

      <div className="mapEmbed">
        <iframe src="https://www.google.com/maps?q=Residence+Inn+Panama+City+Panama&output=embed"></iframe>
      </div>

      <a href="https://maps.app.goo.gl/3KXvJ3uXy4ZkVY6d8" target="_blank">
        Open in Maps
      </a>
    </div>

    <div className="detailCard">
      <h3>Plaza Paitilla Inn</h3>
      <p>Great value · Ocean view · Central</p>
      <p><strong>Approx:</strong> $90 – $160 / night</p>

      <div className="mapEmbed">
        <iframe src="https://www.google.com/maps?q=Plaza+Paitilla+Inn&output=embed"></iframe>
      </div>

      <a href="https://maps.app.goo.gl/Wq6v6i6m7vV3W9zK8" target="_blank">
        Open in Maps
      </a>
    </div>

    <div className="detailCard">
      <h3>Riu Plaza Panamá</h3>
      <p>Central · Social · Lively</p>
      <p><strong>Approx:</strong> $110 – $200 / night</p>

      <div className="mapEmbed">
        <iframe src="https://www.google.com/maps?q=Riu+Plaza+Panama&output=embed"></iframe>
      </div>

      <a href="https://maps.app.goo.gl/G5V7y9FvJg1c3QYp9" target="_blank">
        Open in Maps
      </a>
    </div>

    <div className="detailCard">
      <h3>Intercontinental Miramar</h3>
      <p>Waterfront · Classic · Balboa Ave</p>
      <p><strong>Approx:</strong> $180 – $320 / night</p>

      <div className="mapEmbed">
        <iframe src="https://www.google.com/maps?q=Intercontinental+Miramar+Panama&output=embed"></iframe>
      </div>

      <a href="https://maps.app.goo.gl/9o3nPp2dP8Y8j8rX8" target="_blank">
        Open in Maps
      </a>
    </div>

    <div className="detailCard">
      <h3>Hilton Panamá (Av. Balboa)</h3>
      <p>Oceanfront · Casino · Great location</p>
      <p><strong>Approx:</strong> $160 – $300 / night</p>

      <div className="mapEmbed">
        <iframe src="https://www.google.com/maps?q=Hilton+Panama+Balboa+Avenue&output=embed"></iframe>
      </div>

      <a href="https://maps.app.goo.gl/qX4nXk8kHjF6rFhF6" target="_blank">
        Open in Maps
      </a>
    </div>

  </div>
</CollapseSection>

<CollapseSection id="eat" className="detailSection" label="International Guide" title="Eat">
  <p className="sectionIntro">
    A curated list of favorite restaurants by area, from fine dining to casual lunches.
  </p>

  <div className="guideListGrid">

    <div className="guideColumn">
      <h3>Costa del Este</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Azahar+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>Azahar</span><small>Fine dining · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Brutto+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>Brutto</span><small>Modern dining</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Segundo+Muelle+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>Segundo Muelle</span><small>Seafood / Peruvian</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Nacion+Sushi+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>Nación Sushi</span><small>Casual</small>
      </a>
    </div>

    <div className="guideColumn">
      <h3>San Francisco</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Maito+Panama" target="_blank" rel="noreferrer">
        <span>Maito</span><small>Fine dining · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Makoto+Panama" target="_blank" rel="noreferrer">
        <span>Makoto</span><small>Japanese · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Casa+Escondida+Panama" target="_blank" rel="noreferrer">
        <span>Casa Escondida</span><small>Casual / cozy</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Tacos+La+Neta+Panama" target="_blank" rel="noreferrer">
        <span>Tacos La Neta</span><small>Casual</small>
      </a>
    </div>

    <div className="guideColumn">
      <h3>Bella Vista / Obarrio</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Fonda+Lo+Que+Hay+Panama" target="_blank" rel="noreferrer">
        <span>Fonda Lo Que Hay</span><small>Panamanian · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=La+Vespa+Panama" target="_blank" rel="noreferrer">
        <span>La Vespa</span><small>Italian</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Filomena+Panama" target="_blank" rel="noreferrer">
        <span>Filomena</span><small>Italian / dinner</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Mahalo+Cocina+y+Jardin+Panama" target="_blank" rel="noreferrer">
        <span>Mahalo</span><small>Brunch / casual</small>
      </a>
    </div>

    <div className="guideColumn">
      <h3>Casco Viejo</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Donde+Jose+Panama" target="_blank" rel="noreferrer">
        <span>Donde José</span><small>Tasting menu · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Santa+Rita+Casco+Viejo+Panama" target="_blank" rel="noreferrer">
        <span>Santa Rita</span><small>Dinner</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Mahalo+Casco+Viejo+Panama" target="_blank" rel="noreferrer">
        <span>Mahalo Casco</span><small>Brunch / lunch</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Caliope+Steakhouse+Panama" target="_blank" rel="noreferrer">
        <span>Caliope</span><small>Steakhouse / dinner</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=CasaCasco+Panama" target="_blank" rel="noreferrer">
        <span>CasaCasco</span><small>Group friendly</small>
      </a>
    </div>

  </div>
</CollapseSection>

<CollapseSection id="drinks" className="detailSection alt" label="International Guide" title="Drinks">
  <p className="sectionIntro">
    Rooftops, cocktail bars and easy spots for a night out.
  </p>

  <div className="guideListGrid">

    <div className="guideColumn">
      <h3>Costa del Este</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Brutto+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>Brutto</span><small>Cocktails / dinner</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Azahar+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>Azahar</span><small>Drinks + dinner · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=La+Fabrica+Costa+del+Este+Panama" target="_blank" rel="noreferrer">
        <span>La Fábrica</span><small>Casual drinks</small>
      </a>
    </div>

    <div className="guideColumn">
      <h3>San Francisco</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Pedro+Mandinga+Panama" target="_blank" rel="noreferrer">
        <span>Pedro Mandinga</span><small>Rum bar · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Casa+Escondida+Panama" target="_blank" rel="noreferrer">
        <span>Casa Escondida</span><small>Casual drinks</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=La+Tana+Panama" target="_blank" rel="noreferrer">
        <span>La Tana</span><small>Wine / small plates</small>
      </a>
    </div>

    <div className="guideColumn">
      <h3>Bella Vista / Obarrio</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Azahar+Panama+Obarrio" target="_blank" rel="noreferrer">
        <span>Azahar</span><small>Rooftop-style dinner</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=La+Vespa+Panama" target="_blank" rel="noreferrer">
        <span>La Vespa</span><small>Elegant dinner + drinks</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Filomena+Panama" target="_blank" rel="noreferrer">
        <span>Filomena</span><small>Pretty cocktails</small>
      </a>
    </div>

    <div className="guideColumn">
      <h3>Casco Viejo</h3>
      <a href="https://www.google.com/maps/search/?api=1&query=Tantalo+Rooftop+Panama" target="_blank" rel="noreferrer">
        <span>Tántalo Rooftop</span><small>Rooftop · Featured</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=CasaCasco+Rooftop+Panama" target="_blank" rel="noreferrer">
        <span>CasaCasco Rooftop</span><small>Rooftop / group friendly</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Selina+Rooftop+Casco+Viejo+Panama" target="_blank" rel="noreferrer">
        <span>Selina Rooftop</span><small>Casual rooftop</small>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&query=Salvaje+Panama+Casco+Viejo" target="_blank" rel="noreferrer">
        <span>Salvaje</span><small>Dinner + nightlife</small>
      </a>
    </div>

  </div>
</CollapseSection>

<CollapseSection id="explore" className="detailSection alt" label="International Guide" title="Explore Panama">

  <p className="sectionIntro">
    A few of our favorite things to do while you're in Panama City.
  </p>

  <div className="guideListGrid">

    {/* ICONIC */}
    <div className="guideColumn">
      <h3>Must See</h3>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d300875-Reviews-Panama_Canal-Panama_City_Panama_Province.html" target="_blank">
        <span>Panama Canal</span>
        <small>Iconic · Visitor Center · Featured</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d307611-Reviews-Casco_Viejo-Panama_City_Panama_Province.html" target="_blank">
        <span>Casco Viejo</span>
        <small>Historic district · Walk, eat & drink</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d309461-Reviews-Amador_Causeway-Panama_City_Panama_Province.html" target="_blank">
        <span>Amador Causeway</span>
        <small>Views · Bike · Sunset</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d3752386-Reviews-Biomuseo-Panama_City_Panama_Province.html" target="_blank">
        <span>Biomuseo</span>
        <small>Frank Gehry · Architecture + nature</small>
      </a>
    </div>

    {/* DAY TRIPS */}
    <div className="guideColumn">
      <h3>Day Trips</h3>

      <a href="https://www.tripadvisor.com/Attraction_Review-g303530-d310239-Reviews-San_Blas_Islands-Guna_Yala_Region.html" target="_blank">
        <span>San Blas Islands</span>
        <small>Crystal clear water · Full day · Featured</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g303530-d308610-Reviews-Taboga_Island-Panama_Province.html" target="_blank">
        <span>Taboga Island</span>
        <small>Beach escape · 30 min ferry</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g298424-d308744-Reviews-Gamboa_Rainforest-Panama_Province.html" target="_blank">
        <span>Gamboa Rainforest</span>
        <small>Nature · Monkeys · Canal views</small>
      </a>
    </div>

    {/* EXPERIENCES */}
    <div className="guideColumn">
      <h3>Experiences</h3>

      <a href="https://www.tripadvisor.com/AttractionProductReview-g294480-d11447283-Panama_Canal_Partial_Transit_Tour-Panama_City_Panama_Province.html" target="_blank">
        <span>Canal Boat Tour</span>
        <small>Transit experience · Featured</small>
      </a>

      <a href="https://www.tripadvisor.com/AttractionProductReview-g294480-d11447821-Monkey_Island_Tour-Panama_City_Panama_Province.html" target="_blank">
        <span>Monkey Island Tour</span>
        <small>Fun · Wildlife · Boat ride</small>
      </a>

      <a href="https://www.tripadvisor.com/AttractionProductReview-g294480-d11448437-Panama_City_Food_Tour-Panama_City_Panama_Province.html" target="_blank">
        <span>Food Tour</span>
        <small>Local flavors · Walking tour</small>
      </a>
    </div>

    {/* SHOPPING / EXTRA */}
    <div className="guideColumn">
      <h3>Shopping & More</h3>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d298132-Reviews-Multiplaza_Pacific_Mall-Panama_City_Panama_Province.html" target="_blank">
        <span>Multiplaza Mall</span>
        <small>Luxury shopping</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d298140-Reviews-Albrook_Mall-Panama_City_Panama_Province.html" target="_blank">
        <span>Albrook Mall</span>
        <small>Huge mall · Everything</small>
      </a>

      <a href="https://www.tripadvisor.com/Attraction_Review-g294480-d298128-Reviews-Cinta_Costera-Panama_City_Panama_Province.html" target="_blank">
        <span>Cinta Costera</span>
        <small>Walk · Jog · Ocean views</small>
      </a>
    </div>

  </div>
</CollapseSection>

<CollapseSection id="tips" className="detailSection" label="International Guide" title="Travel Tips">

  <p className="sectionIntro">
    A few helpful things to know before and during your stay in Panama.
  </p>

  <div className="tipsGrid">

    <div className="tipCard">
      <h3>Getting Around</h3>
      <p>Uber is the easiest and most reliable way to move around the city.</p>
      <p>Taxis are also available but usually cash only.</p>
    </div>

    <div className="tipCard">
      <h3>Currency</h3>
      <p>Panama uses the US Dollar (USD).</p>
      <p>Credit cards are widely accepted.</p>
    </div>

    <div className="tipCard">
      <h3>Weather</h3>
      <p>Warm and humid year-round (75–90°F).</p>
      <p>Light clothing recommended + occasional rain.</p>
    </div>

    <div className="tipCard">
      <h3>What to Wear</h3>
      <p>Day: light, breathable outfits.</p>
      <p>Night: smart casual / dressy for dinners.</p>
    </div>

    <div className="tipCard">
      <h3>Safety</h3>
      <p>Panama City is generally safe.</p>
      <p>Use common sense and Uber at night.</p>
    </div>

    <div className="tipCard">
      <h3>Language</h3>
      <p>Spanish is the main language.</p>
      <p>English is widely spoken in restaurants and hotels.</p>
    </div>

    <div className="tipCard">
      <h3>Electricity</h3>
      <p>Same as the US (110V).</p>
      <p>No adapter needed for US plugs.</p>
    </div>

    <div className="tipCard">
      <h3>Contact</h3>
      <p>If you need anything during your stay, feel free to reach out.</p>
      <p>We’re happy to help</p>
    </div>

  </div>
</CollapseSection>



<footer className="footer">
  <p>With love, Rafael & Jimena</p>
  <span>July 2026</span>
</footer>
      </main>
      </div>
    </>
  )
}

export default App
