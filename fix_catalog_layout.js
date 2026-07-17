const fs = require('fs');
const file = 'src/components/collections2/CatalogLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of the aside content
const asideStart = content.indexOf('{/* Search */}');
// Find the end of the aside content
const asideEnd = content.indexOf('</aside>');

if (asideStart === -1 || asideEnd === -1) {
  console.log('Could not find aside content');
  process.exit(1);
}

const filterContent = content.slice(asideStart, asideEnd);

// Create the variable definition
const varDef = `
  const filterPanelContent = (
    <div className="flex flex-col gap-10">
      ${filterContent}
    </div>
  );

`;

// Insert the variable definition before the return statement
const returnMatch = '  return (\n    <main id="catalog"';
content = content.replace(returnMatch, varDef + returnMatch);

// Replace the aside content with {filterPanelContent}
const newAsideContent = `
        {/* ── LEFT: Sticky Filter Panel ─────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col gap-10 w-[180px] xl:w-[200px] flex-shrink-0"
          style={{ position: 'sticky', top: '120px', alignSelf: 'flex-start' }}
        >
          {filterPanelContent}
        </aside>`;

const oldAsideFull = content.slice(content.indexOf('{/* ── LEFT: Sticky Filter Panel ─────────────────────────── */}'), content.indexOf('</aside>') + 8);
content = content.replace(oldAsideFull, newAsideContent);

// Add Floating Button and Drawer before </main>
const drawerHTML = `
      {/* ── Mobile Floating Filter Button ─────────────────────────── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-ink text-canvas px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-transform hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-[1.5px] fill-none">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Filter & Sort
          {hasActiveFilters && (
            <span className="flex items-center justify-center w-[18px] h-[18px] bg-sage text-canvas rounded-full text-[9px] ml-1 font-bold">
              {currentMaterials.length + currentGroups.length + (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile Drawer ─────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-start">
          <div 
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-[85%] max-w-[340px] bg-canvas h-full overflow-y-auto flex flex-col pt-8 pb-24 px-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-sage/30 pb-4">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-ink">Filters</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 text-ink">
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current stroke-[1.5px] fill-none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            {filterPanelContent}
          </div>
        </div>
      )}
`;

content = content.replace('    </main>', drawerHTML + '    </main>');

fs.writeFileSync(file, content);
console.log('Successfully updated CatalogLayout.tsx');
