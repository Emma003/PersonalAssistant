
const BackgroundVideo = () => {
  return (
    <div>
        <video autoPlay muted loop className="bg-video">
            <source src={require('../assets/forest_bg_video.mp4')} type="video/mp4" />
        </video>
    </div>
    
  );
}

export default BackgroundVideo;