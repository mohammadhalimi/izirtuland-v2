// روش جایگزین - استفاده از iframe گوگل مپ
import { component$ } from '@builder.io/qwik';

export const LeafletMap = component$(() => {

  const lat = 35.730314;  // latitude
  const lng = 51.444864; // longitude
  
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div class="w-full h-96 lg:h-[500px] rounded-b-2xl overflow-hidden">
      <iframe
        src={`${mapUrl}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="نقشه محل شرکت پربار باغستان"
      ></iframe>
    </div>
  );
});