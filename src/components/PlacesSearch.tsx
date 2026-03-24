"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

interface PlacesSearchProps {
  onSelect: (data: {
    salonName: string;
    placeId: string;
    reviewUrl: string;
  }) => void;
}

export function PlacesSearch({ onSelect }: PlacesSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      setError("APIキーが設定されていません");
      return;
    }

    const scriptId = "google-maps-script";

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["establishment"],
            componentRestrictions: { country: "jp" },
            fields: ["place_id", "name"],
          }
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.place_id) return;
          onSelect({
            salonName: place.name || "",
            placeId: place.place_id,
            reviewUrl: `https://search.google.com/local/reviews?placeid=${place.place_id}`,
          });
        });
        autocompleteRef.current = autocomplete;
      } catch (e) {
        setError("検索の初期化に失敗しました");
        console.error(e);
      }
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    if (document.getElementById(scriptId)) {
      window.initGoogleMaps = initAutocomplete;
      return;
    }

    window.initGoogleMaps = initAutocomplete;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => setError("Google Mapsの読み込みに失敗しました");
    document.head.appendChild(script);
  }, []);

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
      {error && (
        <p style={{ color: "#b64d4d", fontSize: "12px", marginTop: "6px" }}>
          {error}
        </p>
      )}
      <p style={{ fontSize: "12px", color: "#888888", marginTop: "6px" }}>
        店舗名を入力すると候補が表示されます。候補を選ぶと店舗情報に反映されます。
      </p>
    </div>
  );
}
