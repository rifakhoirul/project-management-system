-- Table: public.projects

-- DROP TABLE IF EXISTS public.projects;

CREATE TABLE IF NOT EXISTS public.projects
(
    projectid integer NOT NULL DEFAULT nextval('projects_projectid_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."C" NOT NULL,
    CONSTRAINT projects_pkey PRIMARY KEY (projectid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.projects
    OWNER to riko;