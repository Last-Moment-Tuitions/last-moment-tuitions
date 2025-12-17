export const loadAdvancedBlocks = (editor) => {
    const bm = editor.BlockManager;

    // --- HERO ---
    bm.add('hero-centered', {
        label: 'Centered Hero',
        category: 'Hero',
        attributes: { class: 'gjs-fonts gjs-f-hero' },
        content: `
      <section class="relative bg-white py-20 px-6 overflow-hidden text-center">
        <div class="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 shadow-sm mb-8 relative z-10">
            <span class="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span class="text-sm font-semibold text-gray-700">Badge Text</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight relative z-10">
            Main Headline <br />
            <span class="text-blue-600 bg-clip-text">Highlighted Text</span>
        </h1>
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
            Your subheadline goes here. Keep it short and engaging.
        </p>
        <div class="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 relative z-10">
             <button class="w-full md:w-auto rounded-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg">Primary Action</button>
        </div>
      </section>
      `
    });

    bm.add('page-header', {
        label: 'Page Header',
        category: 'Hero',
        content: `
        <div class="bg-white border-b border-gray-200 py-8">
            <div class="container mx-auto px-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded font-bold">New</span>
                            <span class="text-sm text-gray-500 flex items-center gap-1">Subtitle / Date</span>
                        </div>
                        <h1 class="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">Page Title</h1>
                        <p class="text-lg text-gray-600 mt-2 max-w-3xl">Brief description or breadcrumb context.</p>
                    </div>
                    <div>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg">Call to Action</button>
                    </div>
                </div>
            </div>
        </div>
        `
    });

    // --- CARDS ---
    bm.add('card-product', {
        label: 'Product Card',
        category: 'Cards',
        attributes: { class: 'gjs-fonts gjs-f-card' },
        content: `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group max-w-sm">
            <div class="relative aspect-video overflow-hidden bg-gray-100">
                <img src="https://via.placeholder.com/800x450" alt="Product" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 tracking-wider border border-gray-200 shadow-sm">
                    CATEGORY
                </div>
            </div>
            <div class="p-5">
                <h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    Product Title
                </h3>
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-yellow-500 font-bold text-sm">★ 4.9</span>
                    <span class="text-gray-400 text-sm">•</span>
                    <span class="text-gray-500 text-sm">1.2k reviews</span>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                        <span class="text-sm font-medium text-gray-700">Author Name</span>
                    </div>
                    <div class="text-lg font-bold text-blue-600">$99.00</div>
                </div>
            </div>
        </div>
        `
    });

    bm.add('card-feature', {
        label: 'Feature Card',
        category: 'Cards',
        content: `
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
            <div class="flex items-center gap-2 mb-2">
                <div class="p-1.5 bg-white rounded-lg border border-gray-200 text-gray-500">
                    <!-- Icon Placeholder -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h4 class="font-bold text-gray-800 text-sm">Feature Title</h4>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed text-xs">
                Description of the feature goes here.
            </p>
        </div>
        `
    });

    // --- LAYOUTS ---
    bm.add('layout-sidebar', {
        label: 'Sidebar Layout',
        category: 'Layout',
        content: `
        <div class="container mx-auto px-6 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-3">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[300px]">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Main Content</h2>
                        <p class="text-gray-700">Drag other blocks here...</p>
                    </div>
                </div>
                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 class="font-bold text-gray-900 mb-4 text-sm uppercase">Sidebar</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="block text-gray-600 hover:text-blue-600">Link 1</a></li>
                            <li><a href="#" class="block text-gray-600 hover:text-blue-600">Link 2</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `
    });

    bm.add('table-info', {
        label: 'Info Table',
        category: 'Briefs',
        attributes: { class: 'gjs-fonts gjs-f-table' },
        content: `
        <div class="overflow-hidden border border-gray-200 rounded-xl my-6">
            <table class="min-w-full divide-y divide-gray-200">
                <tbody class="divide-y divide-gray-200 bg-white">
                    <tr class="hover:bg-gray-50">
                        <td class="w-1/3 px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-100">Label 1</td>
                        <td class="px-4 py-3 text-sm text-gray-900 font-semibold">Value 1</td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                        <td class="w-1/3 px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-100">Label 2</td>
                        <td class="px-4 py-3 text-sm text-gray-900 font-semibold">Value 2</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `
    });

    // --- HOMEPAGE SECTIONS ---

    // 1. Categories Grid
    bm.add('grid-categories', {
        label: 'Categories Grid',
        category: 'Sections',
        content: `
         <section class="py-12">
            <div class="container mx-auto px-4">
                <div class="text-center mb-10">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse top category</h2>
                    <p class="text-gray-600 text-lg">Explore our most popular course categories</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <!-- Category Item -->
                    <div class="p-6 rounded-2xl bg-blue-50 border border-transparent hover:border-blue-200 transition-all cursor-pointer group">
                        <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-blue-600">
                           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Development</h3>
                        <p class="text-sm text-gray-500">200+ Courses</p>
                    </div>
                     <!-- Category Item (Duplicate as needed) -->
                    <div class="p-6 rounded-2xl bg-green-50 border border-transparent hover:border-green-200 transition-all cursor-pointer group">
                        <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-green-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Business</h3>
                        <p class="text-sm text-gray-500">120+ Courses</p>
                    </div>
                </div>
            </div>
         </section>
         `
    });

    // 2. Course Grid Section
    bm.add('section-courses', {
        label: 'Course Grid',
        category: 'Sections',
        content: `
        <section class="py-12 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-10">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Best Selling Courses</h2>
                    <p class="text-gray-600 text-lg">Top-rated picks for you</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <!-- Drop Course Cards Here -->
                     <div class="bg-white rounded-2xl shadow-sm p-8 text-center border border-dashed border-gray-300">
                        <p class="text-gray-400">Drag 'Product Card' blocks here</p>
                     </div>
                </div>
            </div>
        </section>
        `
    });

    // 3. Feature Course Card (Horizontal)
    bm.add('card-feature-course', {
        label: 'Feature Course Card',
        category: 'Cards',
        content: `
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all">
            <div class="w-1/3 aspect-video rounded-xl bg-gray-100 overflow-hidden relative shrink-0">
                 <img src="https://via.placeholder.com/400x300" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 flex flex-col justify-center">
                <div class="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Design</div>
                <h3 class="font-bold text-gray-900 mb-2 leading-tight">Advanced UI/UX Design Course</h3>
                <div class="flex items-center gap-2 mt-auto">
                     <span class="text-lg font-bold text-gray-900">$24.00</span>
                     <span class="text-yellow-500 text-sm font-bold">★ 4.8</span>
                </div>
            </div>
        </div>
        `
    });

    // 4. Testimonials (Grid)
    bm.add('section-testimonials', {
        label: 'Testimonials Grid',
        category: 'Sections',
        content: `
        <section class="py-12 bg-white">
             <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900">Loved by students</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Testimonial 1 -->
                    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p class="text-gray-700 italic mb-4">"This course changed my career path completely. Highly recommended!"</p>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                                <img src="https://via.placeholder.com/100" class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div class="font-bold text-sm text-gray-900">Sarah Johnson</div>
                                <div class="text-xs text-gray-500">Product Designer</div>
                            </div>
                        </div>
                    </div>
                     <!-- Testimonial 2 -->
                    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p class="text-gray-700 italic mb-4">"Amazing content and great instructors."</p>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                                <img src="https://via.placeholder.com/100" class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div class="font-bold text-sm text-gray-900">Mike Chen</div>
                                <div class="text-xs text-gray-500">Developer</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </section>
        `
    });

    // 5. Split CTA (Instructor)
    bm.add('section-cta-split', {
        label: 'Split CTA Section',
        category: 'Sections',
        content: `
        <section class="py-20 container mx-auto px-4">
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                <div class="md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white flex flex-col justify-center">
                    <h2 class="text-4xl font-bold mb-6">Become an instructor</h2>
                    <p class="text-white/90 text-lg mb-8 leading-relaxed">
                        Teach what you love. We provide the tools and skills to teach millions of students.
                    </p>
                    <button class="bg-white text-blue-600 hover:bg-gray-50 w-fit rounded-full px-8 py-3 font-bold shadow-lg">
                        Start Teaching Today
                    </button>
                </div>
                <div class="md:w-1/2 p-12 bg-gray-50 flex flex-col justify-center">
                     <img src="https://via.placeholder.com/600x400" class="rounded-xl shadow-sm w-full h-auto object-cover" />
                </div>
            </div>
        </section>
        `
    });

    // 6. FAQ Accordion
    bm.add('list-faq', {
        label: 'FAQ Accordion',
        category: 'Lists',
        content: `
        <section class="max-w-3xl mx-auto py-12 px-4">
            <h2 class="text-3xl font-bold text-center mb-10">Frequency Asked Questions</h2>
            <div class="space-y-4">
                <details class="group bg-gray-50 p-4 rounded-xl cursor-pointer open:bg-white open:shadow-sm open:ring-1 open:ring-gray-200 transition-all">
                    <summary class="flex justify-between items-center font-bold text-gray-800 list-none">
                        <span>How do I access my courses?</span>
                        <span class="transition group-open:rotate-180">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="text-gray-600 mt-4 leading-relaxed text-sm">
                        Once enrolled, you can access your courses anytime from your dashboard.
                    </div>
                </details>
                
                <details class="group bg-gray-50 p-4 rounded-xl cursor-pointer open:bg-white open:shadow-sm open:ring-1 open:ring-gray-200 transition-all">
                    <summary class="flex justify-between items-center font-bold text-gray-800 list-none">
                        <span>Can I get a refund?</span>
                        <span class="transition group-open:rotate-180">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div class="text-gray-600 mt-4 leading-relaxed text-sm">
                        Yes, we offer a 30-day money-back guarantee if you are not satisfied.
                    </div>
                </details>
            </div>
        </section>
        `
    });
};
