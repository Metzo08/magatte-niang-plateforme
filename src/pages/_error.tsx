import { NextPageContext } from 'next';

function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
      <h1>{statusCode ? `Erreur ${statusCode}` : 'Une erreur est survenue'}</h1>
      <p>Une interruption s'est produite sur le serveur.</p>
      <a href="/" style={{ color: '#2D6A8E', textDecoration: 'underline' }}>
        Retour à l'accueil
      </a>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
