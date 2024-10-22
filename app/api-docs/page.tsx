import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('../swagger'), { ssr: false });

export default function SwaggerPage() {
    return <SwaggerUI />;
}
