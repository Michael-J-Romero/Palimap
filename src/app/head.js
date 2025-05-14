// app/head.js
export default function Head() {
  return (
    <>
      <title>Palisades Recovery</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                const theme = localStorage.getItem('theme');
                console.log('Theme from localStorage:', theme);
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  );
}
