import {NextApiRequest, NextApiResponse} from "next";
import serverApi from "../../api";
import {parseToNumber} from "../../utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await serverApi.searchMovies({
        page: parseToNumber(req.query?.page, 1),
        year: parseToNumber(req.query?.year, Number(process.env.DEFAULT_YEAR)),
        title: req.query?.title?.toString() ?? process.env.DEFAULT_TITLE
    });

    res.status(200).json(data)
}