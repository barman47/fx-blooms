import Layout from '../../components/layout';
import Hero from './Hero';
import Features from './Features';
import AboutUs from './AboutUs';
import Contact from './Contact';

const index = () => {
    return (
        <Layout
            title="Home"
        >
            <Hero />
            <Features />
            <AboutUs />
            <Contact />
        </Layout>
    );
}

export default index;