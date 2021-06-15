import Layout from '../../components/layout';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import Stats from './Stats';
import Contact from './Contact';

const index = () => {
    return (
        <Layout
            title="Home"
        >
            <Hero />
            <Features />
            <Testimonials />
            <Stats />
            <Contact />
        </Layout>
    );
}

export default index;