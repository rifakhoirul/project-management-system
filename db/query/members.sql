-- Table: public.members

-- DROP TABLE IF EXISTS public.members;

CREATE TABLE IF NOT EXISTS public.members
(
    id integer NOT NULL DEFAULT nextval('members_id_seq'::regclass),
    userid integer NOT NULL DEFAULT nextval('members_userid_seq'::regclass),
    role character varying(17) COLLATE pg_catalog."default" NOT NULL,
    projectid integer NOT NULL DEFAULT nextval('members_projectid_seq'::regclass),
    CONSTRAINT members_pkey PRIMARY KEY (id),
    CONSTRAINT projectid FOREIGN KEY (projectid)
        REFERENCES public.projects (projectid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT userid FOREIGN KEY (userid)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.members
    OWNER to riko;