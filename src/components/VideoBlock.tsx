import type { IArticleVideo } from "@/lib/cmsArticle";

interface IVideoBlockProps {
  videos: IArticleVideo[];
}

export const VideoBlock = (props: IVideoBlockProps) => {
  const { videos } = props;
  if (videos.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-sans text-2xl font-semibold text-ink">Vídeo</h2>
      <div className="mt-4 grid gap-4">
        {videos.map((video) =>
          video.kind === "youtube" ? (
            <div key={video.id} className="relative aspect-video w-full overflow-hidden border border-line">
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.youtube.com/embed/${video.id}`}
                title="Vídeo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <p key={video.href}>
              <a href={video.href} className="font-semibold text-accent" rel="noopener noreferrer" target="_blank">
                Abrir vídeo
              </a>
            </p>
          ),
        )}
      </div>
    </section>
  );
};
