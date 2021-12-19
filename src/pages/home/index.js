import Layout from '../../components/layout';
import Hero from './Hero';
import Features from './Features';
import AboutUs from './AboutUs';
import HowToUse from './HowToUse';
import FAQs from './FAQs';
import Contact from './Contact';

const index = () => {
    return (
        <Layout
            title="Peer-to-peer currency exchange platform."
            description="Your trusted P2P currency exchange platform. FXBLOOMS is committed to making currency exchange more accessible, secure and seamless."
        >
            <Hero />
            <Features />
            <AboutUs />
            <HowToUse />
            <FAQs />
            <Contact />
        </Layout>
    );
}

export default index;