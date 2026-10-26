const fs = require('fs');
const path = require('path');

const images = [
  // Selvedge Denim Trouser in Vintage Indigo
  {
    dest: 'public/images/products/selvedge-denim-indigo-1.jpg',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    desc: 'Selvedge denim front full view'
  },
  {
    dest: 'public/images/products/selvedge-denim-indigo-2.jpg',
    url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&auto=format&fit=crop&q=80',
    desc: 'Selvedge denim back and pocket view'
  },
  {
    dest: 'public/images/products/selvedge-denim-indigo-3.jpg',
    url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80',
    desc: 'Selvedge denim weave and seam close-up'
  },
  {
    dest: 'public/images/products/selvedge-denim-indigo-4.jpg',
    url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&auto=format&fit=crop&q=80',
    desc: 'Selvedge denim styled on model outdoors'
  },

  // Pima Cotton Crewneck Tee in Mineral Navy
  {
    dest: 'public/images/products/pima-tee-navy-1.jpg',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    desc: 'Pima cotton tee front flat view'
  },
  {
    dest: 'public/images/products/pima-tee-navy-2.jpg',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    desc: 'Pima cotton tee back view on minimalist hanger'
  },
  {
    dest: 'public/images/products/pima-tee-navy-3.jpg',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    desc: 'Pima cotton collar ribbing macro texture'
  },
  {
    dest: 'public/images/products/pima-tee-navy-4.jpg',
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    desc: 'Pima cotton tee editorial styled on model'
  },

  // Pleated Wide-Leg Wool Trousers in Charcoal
  {
    dest: 'public/images/products/wool-trouser-charcoal-1.jpg',
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    desc: 'Wool trouser front pleat tailored view'
  },
  {
    dest: 'public/images/products/wool-trouser-charcoal-2.jpg',
    url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80',
    desc: 'Wool trouser back drape view'
  },
  {
    dest: 'public/images/products/wool-trouser-charcoal-3.jpg',
    url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80',
    desc: 'Wool trouser waistband tab and fabric detail'
  },
  {
    dest: 'public/images/products/wool-trouser-charcoal-4.jpg',
    url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80',
    desc: 'Wool trouser styled walking editorial'
  },

  // Artisanal Silk Cotton Kurta in Ivory
  {
    dest: 'public/images/products/artisanal-kurta-ivory-1.jpg',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    desc: 'Kurta front placket handloom view'
  },
  {
    dest: 'public/images/products/artisanal-kurta-ivory-2.jpg',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    desc: 'Kurta back silhouette drape'
  },
  {
    dest: 'public/images/products/artisanal-kurta-ivory-3.jpg',
    url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    desc: 'Kurta handloom thread and button detail'
  },
  {
    dest: 'public/images/products/artisanal-kurta-ivory-4.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    desc: 'Kurta styled model portrait'
  },

  // Quilted Utility Overshirt in Forest Olive
  {
    dest: 'public/images/products/quilted-overshirt-olive-1.jpg',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    desc: 'Quilted overshirt front zip view'
  },
  {
    dest: 'public/images/products/quilted-overshirt-olive-2.jpg',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    desc: 'Quilted overshirt back view'
  },
  {
    dest: 'public/images/products/quilted-overshirt-olive-3.jpg',
    url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    desc: 'Quilted pattern stitching and snap button detail'
  },
  {
    dest: 'public/images/products/quilted-overshirt-olive-4.jpg',
    url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    desc: 'Quilted overshirt styled layered look'
  },

  // Supima Ribbed Knit Polo in Oatmeal
  {
    dest: 'public/images/products/ribbed-polo-oatmeal-1.jpg',
    url: 'https://images.unsplash.com/photo-1625910513413-5b822d645f78?w=800&auto=format&fit=crop&q=80',
    desc: 'Ribbed polo front view'
  },
  {
    dest: 'public/images/products/ribbed-polo-oatmeal-2.jpg',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    desc: 'Ribbed polo back view'
  },
  {
    dest: 'public/images/products/ribbed-polo-oatmeal-3.jpg',
    url: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80',
    desc: 'Ribbed knit stitch and collar detail'
  },
  {
    dest: 'public/images/products/ribbed-polo-oatmeal-4.jpg',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    desc: 'Ribbed polo styled look'
  },

  // Cashmere Wool Overcoat in Camel
  {
    dest: 'public/images/products/cashmere-overcoat-camel-1.jpg',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    desc: 'Cashmere overcoat front view'
  },
  {
    dest: 'public/images/products/cashmere-overcoat-camel-2.jpg',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    desc: 'Cashmere overcoat back silhouette'
  },
  {
    dest: 'public/images/products/cashmere-overcoat-camel-3.jpg',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    desc: 'Cashmere lapel and brushed wool detail'
  },
  {
    dest: 'public/images/products/cashmere-overcoat-camel-4.jpg',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    desc: 'Cashmere overcoat editorial on model'
  },

  // Categories
  {
    dest: 'public/images/categories/cat-shirts.jpg',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    desc: 'Category Shirts'
  },
  {
    dest: 'public/images/categories/cat-hoodies.jpg',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    desc: 'Category Hoodies'
  },
  {
    dest: 'public/images/categories/cat-jackets.jpg',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    desc: 'Category Jackets'
  },
  {
    dest: 'public/images/categories/cat-trousers.jpg',
    url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    desc: 'Category Trousers'
  },
  {
    dest: 'public/images/categories/cat-traditional.jpg',
    url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80',
    desc: 'Category Kurtas'
  },

  // Banners & About
  {
    dest: 'public/images/banners/split-banner-promo.jpg',
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    desc: 'Promotional split banner'
  },
  {
    dest: 'public/images/about/about-craftsmanship.jpg',
    url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1000&auto=format&fit=crop&q=80',
    desc: 'Atelier craftsmanship'
  },
  {
    dest: 'public/images/about/about-materials.jpg',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80',
    desc: 'Natural textiles and raw organic fibers'
  }
];

// Verify all dest paths are unique
const destSet = new Set();
for (const item of images) {
  if (destSet.has(item.dest)) {
    console.error('Duplicate destination detected:', item.dest);
    process.exit(1);
  }
  destSet.add(item.dest);
}

// Verify all URLs are unique
const urlSet = new Set();
for (const item of images) {
  if (urlSet.has(item.url)) {
    console.error('Duplicate URL detected:', item.url);
    process.exit(1);
  }
  urlSet.add(item.url);
}

console.log(`Starting download of ${images.length} unique assets...`);

async function run() {
  let successCount = 0;
  for (const item of images) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 5000) {
        throw new Error(`File too small: ${buffer.byteLength} bytes`);
      }
      fs.writeFileSync(path.resolve(item.dest), Buffer.from(buffer));
      console.log(`✓ Saved ${item.dest} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
      successCount++;
    } catch (err) {
      console.error(`✗ Error downloading ${item.dest}:`, err.message);
    }
  }
  console.log(`Finished: ${successCount}/${images.length} successfully downloaded.`);
}

run();
