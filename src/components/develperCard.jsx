function DeveloperCard() {
  return (
    <div className="bg-slate-900/95 text-white py-20 flex justify-center">
      <div className="relative w-full max-w-md">
        {/* Back Layer (Gradient Tilted Card) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl transform rotate-6"></div>

        {/* Front Main Card */}
        <div className="relative bg-slate-800 rounded-3xl p-8 transform -rotate-3 shadow-2xl">
          {/* Fake MacOS Top Bar */}
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          {/* Developer Info Code */}
          <div className="space-y-2 font-mono text-sm text-left">
            <div className="text-purple-400">
              const <span className="text-blue-400">developer</span> = {'{'}
            </div>
            <div className="pl-4 text-slate-300">
              name: <span className="text-green-400">'Syed Imran M. Zaidi'</span>,
            </div>
            <div className="pl-4 text-slate-300">
              role: <span className="text-green-400">'Software Engineer'</span>,
            </div>
            <div className="pl-4 text-slate-300">skills: [</div>
            <div className="pl-8 text-green-400">'JavaScript', 'Python',</div>
            <div className="pl-8 text-green-400">'React', 'Django'</div>
            <div className="pl-4 text-slate-300">],</div>
            <div className="pl-4 text-slate-300">
              experience: <span className="text-orange-400">'2 years'</span>,
            </div>
            <div className="pl-4 text-slate-300">
              available: <span className="text-orange-400">true</span>
            </div>
            <div className="text-purple-400">{'};'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperCard;
