        import React, { useEffect, useState } from 'react';
        import { fetchUserUploads } from '../services/userView';


        const UserViewModal = ({ userId, period, isOpen, onClose }) => {
          const [dataByDate, setDataByDate] = useState({});
          const [page, setPage] = useState(1);
          const [hasMore, setHasMore] = useState(true);
          const [previewSrc, setPreviewSrc] = useState(null);
          const [previewType, setPreviewType] = useState(null);

          useEffect(() => {
            if (!isOpen) return;

            const load = async () => {
              try {
                let refDate;
                if (period.toLowerCase() === 'lastmonth') {
                  const now = new Date();
                  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                  refDate = lastDayOfLastMonth.toLocaleDateString('sv-SE'); // "YYYY-MM-DD"
                } else {
                  refDate = new Date().toLocaleDateString('sv-SE');
                }
                //console.log(refDate);
                const resp = await fetchUserUploads(userId, period, page, refDate);
                //console.log(period);
                //console.log("📦 Raw response:", resp);

                const meals = resp.mealsByDate || {};
                //console.log("🍽️ Meals by date:", meals);

                // build progressMap from BOTH resp.progressByDate AND resp.progress
                const progressMap = {
                  ...(resp.progressByDate || {}),
                };

                if (resp.progress) {
                  const d = new Date(resp.progress.date).toISOString().slice(0, 10);
                  progressMap[d] = resp.progress;
                }

                //console.log("🏃 Progress by date:", progressMap);


                const allDates = new Set([
                  ...Object.keys(meals),
                  ...Object.keys(progressMap),
                ]);
                //console.log("📅 All dates:", Array.from(allDates));

                const merged = {};
                allDates.forEach(date => {
                  merged[date] = {
                    meals: meals[date] || { Breakfast: [], Lunch: [], Dinner: [] },
                    progress: progressMap[date] || {},
                  };
                });
                //console.log("🔗 Merged data:", merged);

                setDataByDate(prev =>
                  page === 1 ? merged : { ...prev, ...merged }
                );
                setHasMore(allDates.size >= 4);
              } catch (err) {
                console.error("❌ Failed to load user uploads", err);
              }
            };

            load();
          }, [isOpen, page, period, userId]);

          if (!isOpen) return null;

          const sortedDates = Object.keys(dataByDate).sort(
            (a, b) => new Date(b) - new Date(a)
          );

          // only show the "no data" message if there are absolutely no dates
          const noDates = sortedDates.length === 0;
          const periodLabels = {
            today: 'Today',
            yesterday: 'Yesterday',
            wtd: 'Week to Date',
            mtd: 'Month to Date',
          };
          const MediaPreviewModal = ({ src, type, onClose }) => {
            if (!src) return null;

            return (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-50 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg"
                >
                  &times;
                </button>

                {type === 'video' ? (
                  <video
                    controls
                    autoPlay
                    className="w-full h-full max-h-screen max-w-screen object-contain rounded"
                  >
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-full max-h-screen max-w-screen object-contain rounded"
                  />
                )}
              </div>
            );
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
                >
                  &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">
                  
                  User Uploads ({periodLabels[period] || period})
                </h2>

                {noDates ? (
                  <p className="text-sm text-gray-600 text-center">
                    No data uploaded for selected period
                  </p>
                ) : (
                  sortedDates.map(date => {
                    const { meals, progress } = dataByDate[date];
                    const hasSteps = Boolean(progress.stepsProof);
                    const hasSkipping = Boolean(progress.skippingProof);
                    const hasMeals =
                      meals.Breakfast.length ||
                      meals.Lunch.length ||
                      meals.Dinner.length;

                    return (
                      <div key={date} className="mb-6 border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {new Date(date).toLocaleDateString('en-GB')}
                        </h3>


                        {/* Proof Section */}
                        <div className="mb-4">
                          <h4 className="font-medium">Steps &amp; Skipping</h4>
                          <div className="flex gap-4 flex-wrap mt-2">
                            {hasSteps ? (
                              <div>
                                <p className="text-sm">Steps:</p>
                                <img
                                  src={progress.stepsProof}
                                  alt="Steps Proof"
                                  className="w-24 h-24 object-cover rounded border cursor-pointer"
                                  onClick={() => {
                                    setPreviewSrc(progress.stepsProof);
                                    setPreviewType('image');
                                  }}
                                />
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No steps image
                              </p>
                            )}

                            {hasSkipping ? (
                              <div>
                                <p className="text-sm">Skipping:</p>
                                    {progress.skippingProof.endsWith(".mp4") ? (
                                <video
                                  controls
                                  className="w-32 h-32 rounded border cursor-pointer"
                                  onClick={() => {
                                    setPreviewSrc(
                                      progress.skippingProof?.startsWith('http')
                                        ? progress.skippingProof
                                        : `${process.env.REACT_APP_API_URL}/${progress.skippingProof}`
                                    );
                                    setPreviewType('video');
                                  }}
                                >
                                  <source
                                    src={
                                      progress.skippingProof?.startsWith('http')
                                        ? progress.skippingProof
                                        : `${process.env.REACT_APP_API_URL}/${progress.skippingProof}`
                                    }
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                ) : (
                                <img
                                  src={progress.skippingProof}
                                  alt="Skipping Proof"
                                  className="w-24 h-24 object-cover rounded border cursor-pointer"
                                  onClick={() => {
                                    setPreviewSrc(progress.skippingProof);
                                    setPreviewType('image');
                                  }}
                                />
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No skipping image/video
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Meals Section */}
                        <div>
                          <h4 className="font-medium">Meals</h4>
                          {['Breakfast', 'Lunch', 'Dinner'].map(type => (
                            <div key={type} className="mb-2">
                              <strong>{type}:</strong>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {meals[type].length > 0 ? (
                                  meals[type].map((img, i) => (
                                    <img
                                      key={i}
                                      src={typeof img === 'string' ? img : img.url}
                                      alt={`${type} ${i + 1}`}
                                      className="w-24 h-24 object-cover rounded border cursor-pointer"
                                      onClick={() => {
                                        setPreviewSrc(typeof img === 'string' ? img : img.url);
                                        setPreviewType('image');
                                      }}
                                    />
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500 ml-2">
                                    No upload
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Pagination */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => hasMore && setPage(p => p + 1)}
                    disabled={!hasMore}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
              <MediaPreviewModal
                src={previewSrc}
                type={previewType}
                onClose={() => {
                  setPreviewSrc(null);
                  setPreviewType(null);
                }}
              />

            </div>
          );
        };

        export default UserViewModal;
