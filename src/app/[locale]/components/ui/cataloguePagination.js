'use client';
import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import ResponsivePagination from "react-responsive-pagination";
import { RxArrowLeft, RxArrowRight } from "react-icons/rx";
import { dropEllipsisThenNav, dropEllipsis } from "react-responsive-pagination/narrowBehaviour";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "../common/loadingSpinner";
import {categoryMapper} from  "../../utils/gameCategoryHelper";

const CataloguePagination = ({ searchParams, searchTerm }) => {

  const customPageRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('GameInfo');
  const [pageCount, setPageCount] = useState(0);
  const pageSize =20;


  function normalizeGenreNames(genre) {
    return genre.replace(/[^\w\s\/&'()\-\+]/g, "").replace(/\+/g, " ").toLowerCase();
  }

  async function fetchGameGenres() {

    const genreResponse = await fetch('/api/catalogue/gameGenres', {
      method: 'POST',

    });

    const dataGenres = await genreResponse.json();
    console.log(dataGenres);
    const genreArr = dataGenres.map((game) => ({
      id: game.id,
      name: game.name.toLowerCase(),
    }));
    console.log("genre arr", genreArr);

    return genreArr;
  }


  const fetchTotalGameCount = async () => {

    const genreArr = await fetchGameGenres();
    const minRating = searchParams.min_ratings ?? 25;
    let countQuery = `where total_rating_count>=${minRating}`;

    if (searchParams.genre) {
      console.log("normalized genre name", normalizeGenreNames(searchParams.genre));
      const genreQuery = genreArr.find((genre) => genre.name === normalizeGenreNames(searchParams.genre));

      countQuery += ` & genres = (${genreQuery.id})`;
    }

    if (searchParams.category) {
      countQuery += ` & category = ${categoryMapper(searchParams.category)}`
    }

    if (searchTerm) {
      countQuery += ` & name ~ *"${searchTerm}"*`;
    }

    countQuery += ';';

    const countResponse = await fetch('/api/catalogue/gameCount', {
      method: 'post',
      body: JSON.stringify({ countQuery }),
    }
    );
    const { count } = await countResponse.json();
    console.log("Game count,", count);
    const totalPages = Math.ceil(count / pageSize);
    setPageCount(totalPages);
  };

  function setCustomPageNr() {
    const url = new URLSearchParams(searchParams);
    url.set("page", parseInt(customPageRef.current.value));
    const urlStr = url.toString();
    router.push(`${pathname}?${urlStr}`)
  }

  const { data: countQueryData, isLoading: countQueryDataIsLoading, isFetching: countQueryDataIsFetching } = useQuery({
    queryKey: ["count-query", searchParams.search, searchParams.genre, searchParams.category, searchParams.page, searchParams.min_ratings],
    queryFn: fetchTotalGameCount,
    keepPreviousData: true,

  })


  const handlePageClick = (data) => {
    const current = new URLSearchParams(searchParams);
    current.set("page", data);
    const pageStr = current.toString();
    const query = pageStr ? `?${pageStr}` : "";
    router.push(`${pathname}${query}`);
  }

  return (
    <div className="flex flex-col mx-auto pagination justify-center items-center w-full lg:w-1/2">
      <ResponsivePagination
        current={parseInt(searchParams.page)}
        total={pageCount}
        onPageChange={handlePageClick}
        nextLabel={<RxArrowRight className="h-6" />}
        previousLabel={<RxArrowLeft className="h-6" />}
        narrowBehaviour={dropEllipsisThenNav}
      />
      <div className="form-control ml-4 mt-2">
        <div className="input-group">
          <input type="number" placeholder={t('customPagePlaceholder')} ref={customPageRef} className="input border-primary w-20" />
          <button className="btn btn-square border-primary" onClick={setCustomPageNr}>
            {t('customPageGo')}
          </button>
        </div>
      </div>

    </div>
  )
}

export default CataloguePagination;