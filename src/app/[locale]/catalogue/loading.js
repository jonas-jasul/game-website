import Skeleton from "react-loading-skeleton";

export default function Loading() {
    const skeletonData = Array.from({ length: 20 });
    return (
        <div className="p-5 flex flex-wrap justify-center items-center">
            {skeletonData.map((_, index) => (
                <div className="card lg:card-side bg-base-100 shadow-xl border border-primary lg:p-0 p-3" key={index}>
                    <figure className="relative w-44 h-60 lg:h-60 lg:w-44">
                        <Skeleton width={300} height={400} />
                    </figure>
                    <div className="card-body p-2 pb-4 lg:p-6 w-60">
                        <h2 className="card-title text-xl"><Skeleton width={200} /></h2>
                        <p><Skeleton width={100} /> </p>
                        <div className="card-actions justify-end">
                            <Skeleton width={100} height={30} />

                        </div>
                    </div>
                </div>
            )
            )}
        </div>
    )
}