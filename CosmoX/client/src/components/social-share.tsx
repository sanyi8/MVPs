import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiFacebook, SiX, SiTiktok } from "react-icons/si";

interface SocialShareProps {
  url?: string;
  text?: string;
}

export function SocialShare({ url, text }: SocialShareProps) {
  const shareUrl = url || window.location.href;
  const shareText = text || "Check out my cosmic profile on CosmoX!";

  const handleShare = (platform: 'facebook' | 'x' | 'tiktok') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'x':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'tiktok':
        // TikTok doesn't have a direct share URL, so we'll copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Share2 className="w-4 h-4 text-gray-400" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        data-testid="share-facebook"
      >
        <SiFacebook className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('x')}
        className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
        data-testid="share-x"
      >
        <SiX className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('tiktok')}
        className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
        data-testid="share-tiktok"
      >
        <SiTiktok className="w-4 h-4" />
      </Button>
    </div>
  );
}
