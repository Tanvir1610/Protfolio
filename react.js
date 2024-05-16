import React from 'react';
import Header from './Header';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Resume from './Resume';
import Contact from './Contact';
import Footer from './Footer';

function Header() {
    return (
        <header>
            <h1>Tanvir Ahmad</h1>
            <p>

                <h2>I am a passionate Web Developer</h2>

                I'm a skilled developer with a deep passion for Full Stack Development and extensive experience in Front-end
                development. My journey in tech has led me to excel in building user-friendly and visually appealing web
                applications.

            </p>
        </header>
    );
}

function About() {
    return (
        <section id="About">
            <h2>About Me</h2>
            <img src="Tanvir.jpeg" alt="Tanvir Ahmad" />
                <p>
                    I am a developer who enjoys solving problems and that is the thing that inspires me to work more on finding
                    relatie

                    solutions. have strong technical skills and an academic background in it engineering. My passion lies in
                    solving and

                    creating solutions for websites and applications. Apart from that t also possess great communication skills

                    In my undergraduate studies Ive taken on various leadership roles, including being the branch coordinator
                    for IEEE

                    GCET SB and leading a communication club for juniors. My personal interests include reading, traveling, and
                    writing

                    My technical interests consist of Software Engineering, Full Stack Web Development, and Android Application

                    Development. Along with these, I've also very keen interest in Cloud technology and Digital Content Writing.
                    I've

                    I will graduate in 2026.

                    I'm actively looking for internships in the domains such as software engineering, Web Development, Andriod

                    Application Development, and Digital Content Writer. I've experienced in terms of freelancing and
                    internships, I've

                    been doing freelancing for many months now. Along with that, I've built many projects as well in the
                    above-mentioned

                    domains

                    I really enjoy learning new things and connecting with people across a range of industries, so don't
                    hesitate to reach

                    out if you'd like to get in touch email at vhoratanvir1610@gmail.com.

                    Competencies: Java, C ,Html, CSS, Javascript, PHP, MySQL, Git, Android Studio, Reactjs Mongodb Blender.

                </p>
                <button onclick="window.location.href='www.linkedin.com/in/tanvirahmadvhora?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'">Learn More</button>
        </section>

    );
}

function App() {
    return (
        <div>
            <Header />
            <About />
            <Skills />
            <Projects />
            <Resume />
            <Contact />
            <Footer />
        </div>
    );
}

export default App;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});