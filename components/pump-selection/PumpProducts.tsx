import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const productsSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const SKETCH_SRC = "/images/pump-selection/products-technical-sketch..png";

type PumpProductsProps = {
  dict: Dictionary;
};

type ProductKey = "fire" | "horizontal" | "vertical";

const products: {
  key: ProductKey;
  src: string;
  width: number;
  height: number;
}[] = [
  {
    key: "fire",
    src: "/images/pump-selection/peerless-fire-pump.png",
    width: 1254,
    height: 1254,
  },
  {
    key: "horizontal",
    src: "/images/pump-selection/peerless-horizontal-pump.png",
    width: 1254,
    height: 1254,
  },
  {
    key: "vertical",
    src: "/images/pump-selection/peerless-vertical-turbine.png",
    width: 1024,
    height: 1536,
  },
];

export function PumpProducts({ dict }: PumpProductsProps) {
  const copy = dict.pumpSelectionPage.products;

  return (
    <section
      id="pump-products"
      className={`oms-pump-products ${productsSans.variable}`}
      aria-labelledby="oms-pump-products-heading"
    >
      <div className="oms-pump-products-media" aria-hidden="true">
        <Image
          src={SKETCH_SRC}
          alt=""
          width={2103}
          height={748}
          className="oms-pump-products-sketch"
          sizes="100vw"
        />
      </div>

      <Container className="oms-pump-products-inner">
        <header className="oms-pump-products-header">
          <span className="oms-pump-products-rule" aria-hidden="true" />
          <h2 id="oms-pump-products-heading" className="oms-pump-products-heading">
            {copy.heading}
          </h2>
          <p className="oms-pump-products-intro">{copy.intro}</p>
        </header>

        <ul className="oms-pump-products-grid">
          {products.map((product) => {
            const item = copy.items[product.key];

            return (
              <li key={product.key} className="oms-pump-products-item">
                <div className="oms-pump-products-figure">
                  <Image
                    src={product.src}
                    alt={item.alt}
                    width={product.width}
                    height={product.height}
                    className="oms-pump-products-image"
                    sizes="(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 28vw"
                  />
                </div>
                <span className="oms-pump-products-label-rule" aria-hidden="true" />
                <h3 className="oms-pump-products-name">
                  <span className="oms-pump-products-name-line">{item.name}</span>
                  {item.nameLine2 ? (
                    <span className="oms-pump-products-name-line">
                      {item.nameLine2}
                    </span>
                  ) : null}
                </h3>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
