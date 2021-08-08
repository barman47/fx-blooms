import Layout from '../../components/layout';
import Hero from './Hero';
import Features from './Features';
import AboutUs from './AboutUs';
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
            <Contact />
        </Layout>
    );
}

export default index;