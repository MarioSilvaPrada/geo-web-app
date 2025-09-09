import { Place } from "@/types";

const categorizeAmenities = (places: Place[]) => {
  const categories: Record<string, Place[]> = {
    "Food & Drink": [],
    Shopping: [],
    Healthcare: [],
    Education: [],
    Transportation: [],
    Entertainment: [],
    Services: [],
    Other: [],
  };

  places.forEach((place) => {
    const amenity = place.tags?.amenity || "";
    const shop = place.tags?.shop || "";
    const leisure = place.tags?.leisure || "";

    if (
      ["restaurant", "cafe", "bar", "pub", "fast_food", "ice_cream"].includes(
        amenity
      )
    ) {
      categories["Food & Drink"].push(place);
    } else if (
      [
        "supermarket",
        "grocery",
        "convenience",
        "clothes",
        "electronics",
        "books",
      ].includes(shop) ||
      ["marketplace", "shopping"].includes(amenity)
    ) {
      categories["Shopping"].push(place);
    } else if (
      ["hospital", "clinic", "pharmacy", "dentist", "veterinary"].includes(
        amenity
      )
    ) {
      categories["Healthcare"].push(place);
    } else if (
      ["school", "university", "college", "kindergarten", "library"].includes(
        amenity
      )
    ) {
      categories["Education"].push(place);
    } else if (["bus_station", "taxi", "fuel", "parking"].includes(amenity)) {
      categories["Transportation"].push(place);
    } else if (
      ["cinema", "theatre", "casino", "nightclub"].includes(amenity) ||
      ["park", "playground", "sports_centre", "swimming_pool"].includes(leisure)
    ) {
      categories["Entertainment"].push(place);
    } else if (
      ["bank", "atm", "post_office", "police", "fire_station"].includes(amenity)
    ) {
      categories["Services"].push(place);
    } else {
      categories["Other"].push(place);
    }
  });

  return categories;
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    "Food & Drink": "🍽️",
    Shopping: "🛍️",
    Healthcare: "🏥",
    Education: "🎓",
    Transportation: "🚌",
    Entertainment: "🎭",
    Services: "🏛️",
    Other: "📍",
  };
  return icons[category] || "📍";
};

export { categorizeAmenities, getCategoryIcon };
