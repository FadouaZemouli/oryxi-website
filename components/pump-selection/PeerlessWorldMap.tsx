import Image from "next/image";

const WORLD_MAP_SRC = "/images/pump-selection/peerless-world-map.png";

export function PeerlessWorldMap() {
  return (
    <div className="oms-peerless-intro-map" aria-hidden="true">
      <Image
        src={WORLD_MAP_SRC}
        alt=""
        width={2103}
        height={748}
        className="oms-peerless-intro-map-image"
        sizes="(max-width: 767px) 92vw, 800px"
      />
    </div>
  );
}
