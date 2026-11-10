import { Flag, Heart, MessageCircle } from "lucide-react";
import useConfirm from "../../hooks/useConfirm";
import useToast from "../../hooks/useToast";
export default function PostCard({ post, onLike, onReport, liking = false }) {
  const { confirm } = useConfirm();
  const toast = useToast();
  const report = async () => {
    if (onReport) {
      await onReport();
      return;
    }
    const accepted = await confirm({
      title: "Report this post?",
      description:       "The moderation team will review this report.",
      confirmText: "Report post",
      variant: "warning",
      onConfirm: async () => {},
    });
    if (accepted)
      toast.success("Post reported.", {
        description: "Thank you for helping keep the community safe.",
      });
  };
  return (
    <article className="card post-card">
      <div className="post-meta">
        <span className="avatar">{post.alias.slice(0, 1)}</span>
        <span>
          <strong>{post.alias}</strong>
          <br />
          {post.time} · {post.category}
        </span>
      </div>
      <div>
        <h3>{post.title}</h3>
        <p className="muted">{post.body}</p>
      </div>
      <div className="post-actions">
        <button onClick={onLike} disabled={liking}>
          <Heart size={16} fill={post.liked ? "currentColor" : "none"} /> {post.likes}
        </button>
        <button>
          <MessageCircle size={16} /> Comment
        </button>
        <button onClick={report}>
          <Flag size={16} /> Report
        </button>
      </div>
    </article>
  );
}
