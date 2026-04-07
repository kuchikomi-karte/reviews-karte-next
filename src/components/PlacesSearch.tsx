"use client";

import { useEffect, useRef, useState } from "react";

type GooglePlace = {
  place_id?: string;
  name?: string;
};

type GoogleAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => void;
  getPlace: () => GooglePlace;
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          options: {
            types: string[];
            componentRestrictions: { country: string };
            fields: string[];
          },
        ) => GoogleAutocomplete;
      };
    };
  };
  initGoogleMaps?: () => void;
};

interface PlacesSearchProps {
  onSelect: (data: {
    salonName: string;
    placeId: string;
    reviewUrl: string;
  }) => void;
}

const SCRIPT_ID = "google-maps-script";

export function PlacesSearch({ onSelect }: PlacesSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const [error, setError] = useState<string | null>(
    apiKey ? null : "APIキーが設定されていません",
  );

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    const typedWindow = window as GoogleMapsWindow;

    const initAutocomplete = () => {
      if (!inputRef.current || !typedWindow.google?.maps?.places) {
        return;
      }

      try {
        const autocomplete = new typedWindow.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["establishment"],
            componentRestrictions: { country: "jp" },
            fields: ["place_id", "name"],
          },
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.place_id) {
            return;
          }

          onSelect({
            salonName: place.name || "",
            placeId: place.place_id,
            reviewUrl: `https://search.google.com/local/reviews?placeid=${place.place_id}`,
          });
        });

        autocompleteRef.current = autocomplete;
        setError(null);
      } catch (currentError) {
        console.error(currentError);
        setError("検索の初期化に失敗しました");
      }
    };

    if (typedWindow.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    if (document.getElementById(SCRIPT_ID)) {
      typedWindow.initGoogleMaps = initAutocomplete;
      return;
    }

    typedWindow.initGoogleMaps = initAutocomplete;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => setError("Google Mapsの読み込みに失敗しました");
    document.head.appendChild(script);
  }, [apiKey, onSelect]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="店舗名または地名を入力"
        style={{
          width: "100%",
          padding: "13px 16px",
          fontSize: "14px",
          border: "1px solid #cccccc",
          borderRadius: "14px",
          outline: "none",
          boxSizing: "border-box",
          color: "#0a0a0a",
          backgroundColor: "white",
        }}
      />
      {error ? (
        <p style={{ color: "#b64d4d", fontSize: "12px", marginTop: "6px" }}>
          {error}
        </p>
      ) : null}
      <p style={{ fontSize: "12px", color: "#888888", marginTop: "6px" }}>
        店舗名を入力すると候補が表示されます。候補を選ぶと店舗情報に反映されます。
      </p>
    </div>
  );
}
